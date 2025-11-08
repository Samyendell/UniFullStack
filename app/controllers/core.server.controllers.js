const Joi = require("joi");
const core = require('../models/core.server.model');
const users = require('../models/user.server.model')

const searchForItem = (req, res) => {
    return res.sendStatus(500);
}


// validate {
//   "name": "Henry Hoover",
//   "description": "Barely used henry hoover - freshly emptied",
//   "starting_bid": 99,
//   "end_date": 89983256
// }

// check end date is in future

// if good send req to model to add item and return 
const createItem = (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        starting_bid: Joi.number().integer().min(1).required(),
        end_date: Joi.number().integer().min(Date.now()).required() 
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error_message: error.details[0].message });

    // Get user ID from authentication middleware
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
        item_id: Joi.number().integer().min(1).required(),
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

        // need to add names and bids and if no bids need to add empty object
        res.status(200).json(item);
    });
}

const bidOnItem = (req, res) => {
    const paramsSchema = Joi.object({
        item_id: Joi.number().integer().min(1).required()
    });

    const bodySchema = Joi.object({
        amount: Joi.number().integer().min(1).required()
    });

    const { paramsError } = paramsSchema.validate(req.params);
    if (paramsError) return res.status(400).json({ error_message: paramsError.details[0].message });

    const { bodyError } = bodySchema.validate(req.body);
    if (bodyError) return res.status(400).json({ error_message: bodyError.details[0].message });

    const itemId = parseInt(req.params.item_id);
    const amount = req.body.amount;

    const bidData = {
        itemId: itemId,
        amount: amount 
    }

    core.bidOnItem(bidData, (err) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "Item not found" });  // use getItem
            }
            if (err === 403) {
                return res.status(403).json({ error_message: "You cannot bid as the seller on this item" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }

    return res.sendStatus(201); // message? 
    })
}

const getBidHistory = (req, res) => {
    return res.sendStatus(500);
}

module.exports = {
    searchForItem: searchForItem,
    createItem: createItem,
    getItem: getItem,
    bidOnItem: bidOnItem,
    getBidHistory: getBidHistory
};