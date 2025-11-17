const Joi = require("joi")
const question = require('../models/question.server.model')
const core = require('../models/core.server.model');
const users = require('../models/user.server.model')


//got all of the methods in now, need to work through the question tests to get them working

const getQuestions = (req, res) => {
    const paramsSchema = Joi.object({
        item_id: Joi.number().min(1).required()
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ error_message: paramsError.details[0].message });
    }

    const itemId = req.params.item_id;

    question.getQuestions(itemId, (err, questions) => {
        if (err) {
            if (err === 404) {
                return res.status(404).json({ error_message: "Question not found" });
            }
            return res.status(500).json({ error_message: "Database error" });
        }


        if (!questions || questions.length === 0) {
            return res.status(200).json([]);
        }

        let questionData = new Array(questions.length);
        let completed = 0;

        questions.forEach((question, index) => {

            questionData[index] = {
                question_id: question.question_id,
                question_text: question.question,
                answer_test: question.answer
            };

            completed++;

            if (completed === questions.length) {
                return res.status(200).json(questionData);
            }
        })
    })
}

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
    const paramsSchema = Joi.object({
        question_id: Joi.number().min(1).required()
    });

    const bodySchema = Joi.object({
        answer_text: Joi.string().required()
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ error_message: paramsError.details[0].message });
    }

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ error_message: bodyError.details[0].message });
    }

    const questionId = req.params.question_id;
    const answerText = req.body.answer_text;
    const token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, userId) => {
        if (err || userId === null) {
            return res.status(401).json({ error_message: "Unauthorized" });
        }

        question.getItemIdFromQuestion(questionId, (err, itemId) => {
            if (err) {
                if (err === 404) {
                    return res.status(404).json({ error_message: "Question not found" });
                }
                return res.status(500).json({ error_message: "Database error" });
            }

            core.getItem(itemId, (err, item) => {
                if (err) {
                    if (err === 404) {
                        return res.status(404).json({ error_message: "Item not found" });
                    }
                    return res.status(500).json({ error_message: "Database error" });
                }

                if (userId !== item.creator_id) {
                    return res.status(403).json({ error_message: "Only the seller can answer questions on their items" });
                }

                const answerData = {
                    questionId: questionId,
                    answerText: answerText,
                }

                question.addAnswer(answerData, (err) => {
                    if (err) {
                        return res.status(500).json({ error_message: "Database error" });
                    }

                    return res.sendStatus(200);

                })

            })
        })
    })
}

module.exports = {
    getQuestions: getQuestions,
    askQuestion: askQuestion,
    answerQuestion: answerQuestion
};

