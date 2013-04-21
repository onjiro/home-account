define(['backbone', 'model/totalAccount'], function(Backbone, TotalAccount) {
    return TotalAccountList = Backbone.Collection.extend({
        model: TotalAccount,
        sqls: {
            read: ''
                + '<% '
                +   'var to, where = [];'
                +    'if (to) {'
                +       'where.push(" date <= " + to.getTime());'
                +    '} '
                + '%>'
                + ''
                + 'SELECT '
                +   'AccountItems.name as item,'
                +   'AccountItemClassifications.name as itemClassification,'
                +   'CASE WHEN SUM(CASE type WHEN \'debit\' THEN amount ELSE 0 END) < SUM(CASE type WHEN \'credit\' THEN amount ELSE 0 END) THEN \'credit\' ELSE \'debit\' END AS type,'
                +   'ABS(SUM(CASE type WHEN \'debit\' THEN amount ELSE 0 END) - SUM(CASE type WHEN \'credit\' THEN amount ELSE 0 END)) AS amount '
                + 'FROM '
                +   'Accounts '
                +   'INNER JOIN AccountItems '
                +     'ON Accounts.itemId = AccountItems.rowid '
                +   'INNER JOIN AccountItemClassifications '
                +     'ON AccountItems.classificationId = AccountItemClassifications.rowid '
                + '<% if (where.length > 0) { %>'
                +   'WHERE '
                +     '<%= where.join(",") + " " %>'
                + '<% } %>'
                + 'GROUP BY '
                +   'itemId '
        },
        parse: function(response) {
            return _.map(response, function(one) {
                return new TotalAccount(one);
            });
            // if (totals.length === 0 && option && option.item) {
            //     totals.push(new TotalAccount({
            //         item: item,
            //         type: 'debit',
            //         amount: 0
            //     }));
            // }
        }
    });
});
