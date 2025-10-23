const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const createAccount = (userData, callback) => {
    const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
    db.run(sql, [userData.username, userData.email, userData.passwordHash], function (err) {
        callback(err, this ? this.lastID : null);
    });
};

const login = (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
        callback(err, row);
    });
};

const logout = (userId, callback) => {
    // Placeholder: no DB action here typically
    callback(null);
};

const getProfileInformation = (userId, callback) => {
    const sql = `SELECT id, username, email FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
        callback(err, row);
    });
};

module.exports = {
    createAccount,
    login,
    logout,
    getProfileInformation
};
