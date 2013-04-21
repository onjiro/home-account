define(['backbone', 'model/accountItem'], function(Backbone, AccountItem) {
    return AccountItemList = Backbone.Collection.extend({
        model: AccountItem,
        sqls: {
            read: ''
                + 'SELECT '
                +   'AccountItems.rowid AS id,'
                +   'AccountItems.name AS name,'
                +   'AccountItemClassifications.name AS classification '
                + 'FROM AccountItems '
                +   'INNER JOIN AccountItemClassifications '
                +     'ON AccountItems.classificationId = AccountItemClassifications.rowid ',
        },
    });
});
