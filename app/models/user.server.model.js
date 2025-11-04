const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const db = new sqlite3.Database('./db.sqlite');

const createAccount = (userData, callback) => {
    // add salt to password ?? here ? controller?
    const sql = `INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)`;
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

const getHash = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

const addNewUser = (user, done) => {
    doesEmailExist(user.email, (err, exists) => {
        if (err) return done(err);
        if (exists) return done(new Error('Email already exists'));

        const salt = crypto.randomBytes(64);
        const hash = getHash(user.password, salt);

        const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)';
        let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

        db.run(sql, values, function (err) {
            if (err) return done(err)
            return done(false, this.lastID);
        })
    })
}

const authenticateUser = (email, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE email=?';

    db.get(sql, [email], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        if (row.salt === null) row.salt = ''

        let salt = Buffer.from(row.salt, 'hex');

        if (row.password === getHash(password, salt)) {
            return done(false, row.user_id)
        } else {
            return done(404)
        }
    })
}

const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?';
    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        return done(false, row.session_token)
    })
}

const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token=? WHERE user_id=?'

    db.run(sql, [token, id], (err) => {
        return done(err, token)
    })
}

const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err) => {
        return done(err)
    })
}

const getIdFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?'
    const params = [token]

    db.get(sql, [token], (err) => {
        return done(err)
    })

    db.get()

}

const login = (username, callback) => {
    const sql = `SELECT * FROM users WHERE username=?`;
    db.get(sql, [username], (err, row) => {
        callback(err, row);
    });
};

const logout = (userId, callback) => {
    // Placeholder: no DB action here typically
    callback(null);
};

const getProfileInformation = (userId, callback) => {
    const sql = `SELECT id, username, email FROM users WHERE id=?`;
    db.get(sql, [userId], (err, row) => {
        callback(err, row);
    });
};

module.exports = {
    createAccount,
    doesEmailExist,
    login,
    addNewUser,
    authenticateUser,
    getToken,
    setToken,
    removeToken,
    getIdFromToken,
    logout,
    getProfileInformation
};
