const userManagement = require('../controllers/userManagement.controllers')

module.exports = function (app) {

    //    app.route('/question-management') do i inlcude this ??

    app.route('/users')
        .post(userManagement.createAccount);

    app.route('/login')
        .post(userManagement.login);

    app.route('/logout')
        .post(userManagement.logout);

    app.route('/users/{user_id}')
        .get(userManagement.getProfileInfomation);

};