$(function() {
    var accountItems = new AccountItemList(),
    accountItemView = new AccountItemConfigureView({
        el: $('#account-item'),
        collection: accountItems,
    });

    db.transaction(function(tx) {
        accountItems.fetch({tx: tx});
    });
});

