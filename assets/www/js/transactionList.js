this.TransactionList = (function(global) {
    return Backbone.Collection.extend({
        model: Transaction,
        
        initialize: function(option) {
            this.db = (option || {}).db;
        },
        sync: function(method, collections, option) {
            var sync = this.sync
            , tx = (option || {}).tx
            , _this = this;
            if (!tx) {
                this.db.transaction(function(tx) {
                    sync.call(_this, method, collections, _.defaults(option, {tx: tx}));
                }, function(err) {
                    alert('something failed while accessing database.\n' + err.message);
                });
                return;
            }

            switch (method) {
            case 'read':
                var sql, where = [];
                if (option.from) {
                    where.push(' Transactions.date >= ' + option.from.getTime());
                }
                sql = ''
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
                    + ((where.length === 0) ? '': 'WHERE' + where.join(',') + ' ')
                    + 'ORDER BY '
                    +   'Transactions.rowid ';
                tx.executeSql(sql, [], function(tx, resultSet) {
                    var transactions, resultArray = [];
                    for (var i = 0; i < resultSet.rows.length; i++) {
                        resultArray.push(resultSet.rows.item(i));
                    }
                    transactions = _.chain(resultArray)
                        .groupBy('id')
                        .map(function(group) {
                            return new Transaction(group[0])
                                .set('accounts', _.map(group, function(one) {
                                    return new Account(one);
                                }));
                        })
                        .value();

                    _this.reset(_.map(transactions, function(one) {
                        return _.defaults(one, {db: db});
                    }) ,option);
                }, function(err) {
                    alert('something failed while accessing database.\n' + err.message);
                });
                break;
            default:
                throw new Error('not supported method called!!');
            }
            collections.trigger('request', collections, method, option);
        },
    })
})(this);
