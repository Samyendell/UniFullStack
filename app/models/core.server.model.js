const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

const searchForItem = (searchTerm, callback) => {
    const sql = `SELECT * FROM items WHERE name LIKE ? OR description LIKE ?`;
    const param = `%${searchTerm}%`;
    db.all(sql, [param, param], (err, rows) => {
        callback(err, rows);
    });
};

const createItem = (itemData, done) => { 
    const sql = `INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id) VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [itemData.name, itemData.description, itemData.starting_bid, itemData.start_date, itemData.end_date, itemData.creator_id];
    db.run(sql, values, function (err) {
        if (err) return done(err)
        return done(false, this.lastID)
    });
};

// need to add name of user to
const getItem = (itemId, done) => {
    const sql = `SELECT * FROM items WHERE item_Id=?`;
    db.get(sql, [itemId], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);
        return done(false, row);
    });
};

const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?';
    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        return done(false, row.session_token)
    })
}

const bidOnItem = (bidData, done) => {
    const sql = `INSERT INTO bids (item_id, user_id, amount, timestamp) VALUES (?, ?, ?, ?)`;
    db.run(sql, [bidData.itemId, bidData.userId, bidData.amount, bidData.timestamp], (err) => {
        if (err) return done(err);
        return done(false);
    });
};

const getBidHistory = (itemId, done) => {
    const sql = `SELECT * FROM bids WHERE item_id = ? ORDER BY timestamp DESC`;
    db.all(sql, [itemId], (err, rows) => {
        if (err) return done(err);

        return done(false, rows)
    });
};

module.exports = {
    searchForItem,
    createItem,
    getItem,
    bidOnItem,
    getBidHistory
};
