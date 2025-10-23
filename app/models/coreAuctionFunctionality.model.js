const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const searchForItem = (searchTerm, callback) => {
    const sql = `SELECT * FROM items WHERE name LIKE ? OR description LIKE ?`;
    const param = `%${searchTerm}%`;
    db.all(sql, [param, param], (err, rows) => {
        callback(err, rows);
    });
};

const createItem = (itemData, callback) => {
    const sql = `INSERT INTO items (name, description, starting_price) VALUES (?, ?, ?)`;
    db.run(sql, [itemData.name, itemData.description, itemData.startingPrice], function (err) {
        callback(err, this ? this.lastID : null);
    });
};

const getItem = (itemId, callback) => {
    const sql = `SELECT * FROM items WHERE id = ?`;
    db.get(sql, [itemId], (err, row) => {
        callback(err, row);
    });
};

const bidOnItem = (bidData, callback) => {
    const sql = `INSERT INTO bids (item_id, user_id, bid_amount) VALUES (?, ?, ?)`;
    db.run(sql, [bidData.itemId, bidData.userId, bidData.bidAmount], function (err) {
        callback(err, this ? this.lastID : null);
    });
};

const getBidHistory = (itemId, callback) => {
    const sql = `SELECT * FROM bids WHERE item_id = ? ORDER BY bid_time DESC`;
    db.all(sql, [itemId], (err, rows) => {
        callback(err, rows);
    });
};

module.exports = {
    searchForItem,
    createItem,
    getItem,
    bidOnItem,
    getBidHistory
};
