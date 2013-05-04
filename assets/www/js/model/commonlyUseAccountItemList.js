define(['backbone', 'model/accountItem'], function(Backbone, AccountItem) {
    return Backbone.Collection.extend({
        model: AccountItem,
        sqls: {
            read: ''
                + 'SELECT '
                +   'AccountItems.rowid as id,'
                +   'AccountItems.name as name,'
                +   'AccountItemClassifications.name as classification '
                + 'FROM AccountItems '
                +   'INNER JOIN AccountItemClassifications '
                +     'ON AccountItems.classificationId = AccountItemClassifications.rowid '
                +   'INNER join ('
                +     'SELECT '
                +       'itemId,'
                +       'count(*) as count '
                +     'FROM Accounts '
                +     'WHERE '
                +       'type = ? '
                +     'GROUP BY '
                +       'itemId '
                +   ') AccountCounts ON AccountItems.rowid = AccountCounts.itemId '
                + 'ORDER BY AccountCounts.count DESC '
                + 'LIMIT ?',
        },
        placeholders: {
            read: ['side', 'limit'],
        },
    });
});
