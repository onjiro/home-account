$(function() {
    var accountItems = new AccountItemList(),
    accountItemClassifications = new AccountItemClassificationList({db: db}),
    accountItemView = new AccountItemConfigureView({
        el: $('#account-item'),
        collection: accountItems,
        classifications: accountItemClassifications,
    });

    accountItemClassifications.fetch();
    db.transaction(function(tx) {
        accountItems.fetch({tx: tx});
    });
});

