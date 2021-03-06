define([
    'backbone',
    'model/account',
    'model/transaction',
], function(Backbone, Account, Transaction) {
    return Backbone.Collection.extend({
        model: Transaction,
        sqls: {
            read: ''
                + '<% '
                +    'var from, where = [];'
                +    'if (from) {'
                +       'where.push(" Transactions.date >= " + from.getTime());'
                +    '} '
                + '%>'
                + ''
                + 'SELECT '
                +   'Transactions.rowid as id,'
                +   'Transactions.date as date,'
                +   'Transactions.details as details,'
                +   'Transactions.rowid as transactionId,'
                +   'AccountItems.name as item,'
                +   'Accounts.amount as amount,'
                +   'Accounts.type as type '
                + 'FROM '
                +   'Transactions '
                +   'INNER JOIN Accounts '
                +     'ON Transactions.rowid = Accounts.transactionId '
                +   'INNER JOIN AccountItems '
                +     'ON Accounts.itemId = AccountItems.rowid '
                + '<% if (where.length > 0) { %>'
                +   'WHERE '
                +     '<%= where.join(",") + " " %>'
                + '<% } %>'
                + 'ORDER BY '
                +   'Transactions.rowid ',
        },

        parse: function(response) {
            return _.chain(response)
                .groupBy('id')
                .map(function(group) {
                    return new Transaction(group[0])
                        .set('accounts', _.map(group, function(one) {
                            return new Account(one);
                        }));
                })
                .value();
        },
    })
});
