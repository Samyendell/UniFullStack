const coreAuctionFunctionality = require('../controllers/coreAuctionFunctionality.controllers')

module.exports = function (app) {

    //    app.route('/question-management') do i inlcude this ??

    app.route('/search')
        .get(coreAuctionFunctionality.searchForItem);

    app.route('/item')
        .post(coreAuctionFunctionality.createItem);

    app.route('/item/{item_id}')
        .get(coreAuctionFunctionality.getItem);

    app.route('/item/{item}/bid')
        .post(coreAuctionFunctionality.bidOnItem)
        .get(coreAuctionFunctionality.getBidHistory);
};