const questionManagement = require('../controllers/questionManagement.controllers')

module.exports = function (app) {

    //    app.route('/question-management') do i inlcude this ??

    app.route('/item/{item_id}/question')
        .get(questionManagement.getQuestions)
        .post(questionManagement.askQuestion);

    app.route('/question/{question_id}')
        .post(questionManagement.answerQuestion);


};