const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const createAccount = (userData, callback) => {
    // add salt to password ?? here ? controller?
    const sql = `INSERT INTO users (first_name, last_name, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [userData.first_name, userData.last_name, userData.email, userData.password_hash, userData.salt], function (err) {
        callback(err, this ? this.lastID : null);
    });
};

const doesEmailExist = (email, callback) => {  // should it be here or in a lib file?
    const sql = 'SELECT user_id FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        callback(err, row ? true : false);
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
    doesEmailExist,
    login,
    logout,
    getProfileInformation
};
