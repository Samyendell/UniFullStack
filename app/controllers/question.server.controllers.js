const Joi = require("joi")
const question = require('../models/question.server.model')
const core = require('../models/core.server.model');
const users = require('../models/user.server.model')

const getQuestions = (req, res) => {
    return res.sendStatus(500);
}

// got ask question in place not all tests passing but some are, maybe should get answer question done as well

const askQuestion = (req, res) => {
    const paramsSchema = Joi.object({
        item_id: Joi.number().min(1).required()  //wrong
    });

    const bodySchema = Joi.object({
        question_text: Joi.string().required()
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ error_message: paramsError.details[0].message });
    }

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ error_message: bodyError.details[0].message });
    }

    const itemId = req.params.item_id;
    const questionText = req.body.question_text;
    const token = req.get('X-Authorization'); 
    // check if its there item
    // check if item exists
    // get 

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

            const questionData = {
                questionText: questionText,
                askedBy: userId,
                itemId: itemId
            }

            question.addQuestion(questionData, (err) => {
                if (err) {
                    return res.status(500).json({ error_message: "Database error" });
                }

                return res.sendStatus(200);

            })

        })
    })
}

const answerQuestion = (req, res) => {
    return res.sendStatus(500);
}

module.exports = {
    getQuestions: getQuestions,
    askQuestion: askQuestion,
    answerQuestion: answerQuestion
};

