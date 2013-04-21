require([
    'jquery',
    'backbone',
    'model/accountItemClassificationList',
    'model/accountItemList',
    'view/accountItemConfigure',
], function($, Backbone, AccountItemClassificationList, AccountItemList, AccountItemConfigureView) {
$(function() {
    var accountItems = new AccountItemList(),
    accountItemClassifications = new AccountItemClassificationList(),
    accountItemView = new AccountItemConfigureView({
        el: $('#account-item'),
        collection: accountItems,
        classifications: accountItemClassifications,
    });
    Backbone.sync.db = db;

    accountItemClassifications.fetch();
    db.transaction(function(tx) {
        accountItems.fetch({tx: tx});
    });
});
});
