const core = require('../controllers/core.server.controllers')

module.exports = function (app) {

    //    app.route('/question-management') do i inlcude this ??

    app.route('/search')
        .get(core.searchForItem);

    app.route('/item')
        .post(core.createItem);

    app.route('/item/{item_id}')
        .get(core.getItem);

    app.route('/item/{item}/bid')
        .post(core.bidOnItem)
        .get(core.getBidHistory);
};