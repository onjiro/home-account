// テスト用に依存モジュールを読み込む
if (this.window === undefined) {
    var Backbone = require('backbone');
    this.Account = require('./account.js').Account;
}
this.Transaction = (function(global) {
    var Transaction = Backbone.Model.extend({
        // properties
        initialize: function(values) {
            values = values || {};
            this.rowid    = values.rowid;
            this.date     = (values.date) ? new Date(values.date): new Date();
            this.accounts = values.accounts || [];
            this.details  = values.details  || "";
        },

        save: function(tx, onSuccess, onError) {
            var _this = this;
            // Transactions テーブルに格納
            tx.executeSql(
                'INSERT INTO Transactions (date, details) VALUES (?, ?)',
                [this.date, this.details],
                function(tx, resultSet) {
                    _this.rowid = resultSet.insertId;
                    // accounts はそれぞれ Accounts テーブルに格納
                    for (var i = 0; i < _this.accounts.length; i++) {
                        _this.accounts[i].transactionId = resultSet.insertId;
                        _this.accounts[i].save(tx, null, onError);
                    }
                    if (onSuccess) { onSuccess(tx, resultSet.insertId, _this); };
                },
                onError
            );
        },

        remove: function(tx, onSuccess, onError) {
            var rowid = this.rowid;
            tx.executeSql(
                'DELETE FROM Transactions where rowid = ?',
                [rowid],
                function(tx, resultSet) {
                    tx.executeSql(
                        'delete from accounts where transactionId = ?',
                        [rowid],
                        onSuccess
                    );
                },
                onError
            );
        }
    }, {
        // class properties
        find: function(tx, onSuccess, onError) {
            var sql = [
                'SELECT',
                '  Transactions.rowid as rowid,',
                '  Transactions.date as date,',
                '  Transactions.details as details,',
                '  Transactions.rowid as transactionId,',
                '  Accounts.item as item,',
                '  Accounts.amount as amount,',
                '  Accounts.type as type',
                'FROM',
                '  Transactions INNER JOIN Accounts ',
                '  ON Transactions.rowid = Accounts.transactionId',
                'ORDER BY',
                '  Transactions.rowid'
            ].join(' ');
            tx.executeSql(sql, [], function(tx, resultSet) {
                var results = [];
                for (var i = 0; i < resultSet.rows.length; i++) {
                    var current = new Transaction(resultSet.rows.item(i));
                    var lastOne = (results.length === 0) ? null: results[results.length - 1];
                    if (!lastOne || current.date.getTime() !== lastOne.date.getTime()) {
                        results.push(current);
                    } else {
                        current = lastOne;
                    }
                    current.accounts.push(new global.Account(resultSet.rows.item(i)));
                };
                onSuccess(tx, results);
            }, onError);
        }
    });
    return Transaction;
})(this);
