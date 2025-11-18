const Joi = require("joi");
const core = require('../models/core.server.model');
const users = require('../models/user.server.model')

const searchForItem = (req, res) => {
    const schema = Joi.object({
        q: Joi.string().allow('').optional(),
        status: Joi.string().valid('BID', 'OPEN', 'ARCHIVE').optional(),
        limit: Joi.number().min(1).max(100).default(20),
        offset: Joi.number().min(0).default(0)
    });

    const { error } = schema.validate(req.query);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const { q, status, limit = 20, offset = 0 } = req.query;
    const token = req.get('X-Authorization');

    // If status filter is used, we need authentication
    if (status && ['BID', 'OPEN', 'ARCHIVE'].includes(status)) {
        // Check if token exists first
        if (!token) {
            return res.status(400).json({ error_message: "Authentication required for status filter" });
        }

        users.getIdFromToken(token, (err, userId) => {
            if (err || userId === null) {
                return res.status(401).json({ error_message: "Unauthorized" });
            }

            searchWithStatus(q, status, userId, parseInt(limit), parseInt(offset), res);
        });
    } else {
        // Simple search by name/description only
        searchBasic(q, parseInt(limit), parseInt(offset), res);
    }
};

const searchBasic = (searchTerm, limit, offset, res) => {
    core.searchForItem(searchTerm, (err, items) => {
        if (err) {
            return res.status(500).json({ error_message: "Database error" });
        }

        // Apply pagination
        const paginatedItems = items.slice(offset, offset + limit);
        
        res.status(200).json(paginatedItems);
    });
};

const searchWithStatus = (searchTerm, status, userId, limit, offset, res) => {
    const currentTime = Date.now();

    switch (status) {
        case 'BID':
            users.getUserActiveBids(userId, (err, activeBids) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                users.getUserEndedAuctions(userId, (err, endedBids) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    let allBids = [...activeBids, ...endedBids];
                    
                    if (searchTerm) {
                        allBids = allBids.filter(item => 
                            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    }

                    const paginatedItems = allBids.slice(offset, offset + parseInt(limit));
                    res.status(200).json(paginatedItems);
                });
            });
            break;

        case 'OPEN':
            // Items created by user that are still active
            users.getUserItems(userId, (err, userItems) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                let openItems = userItems.filter(item => item.end_date > currentTime);

                // Filter by search term if provided
                if (searchTerm) {
                    openItems = openItems.filter(item => 
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                // Apply pagination
                const paginatedItems = openItems.slice(offset, offset + parseInt(limit));
                res.status(200).json(paginatedItems);
            });
            break;

        case 'ARCHIVE':
            // Items created by user where bidding has closed
            users.getUserItems(userId, (err, userItems) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                let archivedItems = userItems.filter(item => item.end_date <= currentTime);

                if (searchTerm) {
                    archivedItems = archivedItems.filter(item => 
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                const paginatedItems = archivedItems.slice(offset, offset + parseInt(limit));
                res.status(200).json(paginatedItems);
            });
            break;

        default:
            return res.status(400).json({ error_message: "Invalid status parameter" });
    }
};

const createItem = (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        starting_bid: Joi.number().integer().min(1).required(),
        end_date: Joi.number().integer().min(Date.now()).required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const token = req.get('X-Authorization');
    users.getIdFromToken(token, (err, userId) => {
        if (err || userId === null) {
            return res.status(401).json({ error_message: "Unauthorized" });
        }

        const itemData = {
            name: req.body.name,
            description: req.body.description,
            starting_bid: req.body.starting_bid,
            start_date: Date.now(),
            end_date: req.body.end_date,
            creator_id: userId
        };

        core.createItem(itemData, (err, itemId) => {
            if (err) {
                return res.status(500).json({ error_message: "Database error" });
            }

            res.status(201).json({
                item_id: itemId
            });
        });
    });
}

// give a item id validate it
// 200 and give back :
// {
//     "item_id": 77,
//     "name": "Henry Hoover",
//     "description": "Barely used henry hoover - freshly emptied",
//     "starting_bid": 99,
//     "start_date": 89983256,
//     "end_date": 89983256,
//     "creator_id": 89,
//     "first_name": "Ash",
//     "last_name": "Williams",
//     "current_bid": 500,
//     "current_bid_holder": {
//       "user_id": 7,
//       "first_name": "Ash",
//       "last_name": "Williams"
//     }
//   }

//if not found - give 404

// db error - 500 server error
const getItem = (req, res) => {
    const schema = Joi.object({
        item_id: Joi.string().pattern(/^\d+$/).required(),
    })

    const { error } = schema.validate(req.params);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    const itemId = parseInt(req.params.item_id);

    core.getItem(itemId, (err, item) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "Item not found" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

        // Get creator information
        users.getProfileInformation(item.creator_id, (err, creator) => {
            if (err) {
                return res.status(500).json({ error_message: "Database error" });
            }

            // Get bid history to find current highest bid
            core.getBidHistory(itemId, (err, bids) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                const itemResponse = {
                    item_id: item.item_id,
                    name: item.name,
                    description: item.description,
                    starting_bid: item.starting_bid,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    creator_id: item.creator_id,
                    first_name: creator.first_name,
                    last_name: creator.last_name
                };

                // If there are no bids, include starting bid and null bid holder
                if (!bids || bids.length === 0) {
                    itemResponse.current_bid = item.starting_bid;
                    itemResponse.current_bid_holder = null; // Set to null for no bids
                    return res.status(200).json(itemResponse);
                }

                // Get the highest bid (first one since they're ordered by timestamp DESC)
                const highestBid = bids[0];
                itemResponse.current_bid = highestBid.amount;

                // Get bid holder information
                users.getProfileInformation(highestBid.user_id, (err, bidHolder) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    itemResponse.current_bid_holder = {
                        user_id: highestBid.user_id,
                        first_name: bidHolder.first_name,
                        last_name: bidHolder.last_name
                    };

                    return res.status(200).json(itemResponse);
                });
            });
        });
    });
}

const bidOnItem = (req, res) => {
    // Validate URL parameters
    const paramsSchema = Joi.object({
        item_id: Joi.string().pattern(/^\d+$/).required()
    });

    // Validate request body
    const bodySchema = Joi.object({
        amount: Joi.number().integer().min(1).required()
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ error_message: paramsError.details[0].message });
    }

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ error_message: bodyError.details[0].message });
    }

    const itemId = parseInt(req.params.item_id);
    const amount = req.body.amount;
    const token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, userId) => {
        if (err || userId === null) {
            return res.status(401).json({ error_message: "Unauthorized" });
        }

        core.getItem(itemId, (err, item) => {
            if (err) {
                if (err === 404) {
                    return res.status(404).json({ error_message: "Item not found" });
                }
                return res.status(500).json({ error_message: "Database error" });
            }

            if (userId === item.creator_id) {
                return res.status(403).json({ error_message: "You cannot bid as the seller on this item" });
            }

            core.getBidHistory(itemId, (err, items) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                let currentBid = item.starting_bid;
                
                if (items && items.length > 0) {
                    currentBid = items[0].amount;
                }

                if (amount <= currentBid) {
                    return res.status(400).json({ error_message: "amount less or equal than current bid" });
                }

                const bidData = {
                    itemId: itemId,
                    userId: userId,
                    amount: amount,
                    timestamp: Date.now()
                };

                core.bidOnItem(bidData, (err) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    return res.sendStatus(201);
                });
            });
        });
    })
}

const getBidHistory = (req, res) => {
    const paramsSchema = Joi.object({
        item_id: Joi.string().pattern(/^\d+$/).required() // wrong
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ error_message: paramsError.details[0].message });
    }

    const itemId = req.params.item_id;

    core.getItem(itemId, (err) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "Item not found" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

        core.getBidHistory(itemId, (err, items) => {
            if (err) {
                return res.status(500).json({ error_message: "Database error" });
            }

            if (!items || items.length === 0) {
                return res.status(200).json([]);
            }

            let bidHistoryData = new Array(items.length);
            let completed = 0;

            items.forEach((bid, index) => {
                users.getProfileInformation(bid.user_id, (err, user) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    bidHistoryData[index] = {
                        item_id: parseInt(itemId),
                        amount: bid.amount,
                        timestamp: bid.timestamp,
                        user_id: bid.user_id,
                        first_name: user.first_name,
                        last_name: user.last_name
                    };

                    completed++;

                    if (completed === items.length) {
                        return res.status(200).json(bidHistoryData);
                    }
                });
            });
        });
    });
};

module.exports = {
    searchForItem: searchForItem,
    createItem: createItem,
    getItem: getItem,
    bidOnItem: bidOnItem,
    getBidHistory: getBidHistory
};