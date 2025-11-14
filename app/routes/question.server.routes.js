const questionManagement = require('../controllers/question.server.controllers')
const auth = require('../lib/authentication')

module.exports = function (app) {

    app.route('/item/:item_id/question')
        .get(questionManagement.getQuestions)
        .post(auth.isAuthenticated, questionManagement.askQuestion);

    app.route('/question/:question_id')
        .post(auth.isAuthenticated, questionManagement.answerQuestion);
        
};