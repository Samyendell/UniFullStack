const Joi = require("joi");
const crypto = require("crypto");
const userManagementRoutes = require("../routes/userManagement.routes");
const userManagementModel = require("../models/userManagement.model");

const createAccount = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        userManagementModel.doesEmailExist(req.body.email, async (err, exists) => {
            if (err) return res.status(500).send("Database error");
            if (exists) return res.status(400).send("Email already exists");


            const salt = crypto.randomBytes(64);
            const password_hash = getHash(req.body.password, salt);

            const userData = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password_hash: password_hash,
                salt: salt
            };

            userManagementModel.createAccount(userData, (err, userId) => {
                if (err) return res.status(500).send("Error creating account");
                res.status(201).json({
                    user_Id: userId
                });
            });
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
}

const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

const login = (req, res) => {
    return res.sendStatus(500);
}

const logout = (req, res) => {
    return res.sendStatus(500);
}

const getProfileInfomation = (req, res) => {
    return res.sendStatus(500);
}

module.exports = {
    createAccount: createAccount,
    login: login,
    logout: logout,
    getProfileInfomation: getProfileInfomation
};