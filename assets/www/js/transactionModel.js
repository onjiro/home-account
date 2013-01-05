this.Transaction = (function(global) {
    // 依存モジュールを読み込む
    var Backbone = global.Backbone, Account = global.Account;
    if (typeof require !== 'undefined') {
        if (!Backbone) Backbone = require('backbone');
        if (!Account) Account = require('./account.js').Account;
    }

    var Transaction = Backbone.Model.extend({
        // properties
        initialize: function(values) {
            values = values || {};
            this.db = values.db;
            this.set({
                id       : values.rowid,
                date     : (values.date) ? new Date(values.date): new Date(),
                accounts : values.accounts || [],
                details  : values.details  || ""
            });
        },

        save: function(tx, onSuccess, onError) {
            var _this = this;
            // Transactions テーブルに格納
            tx.executeSql(
                'INSERT INTO Transactions (date, details) VALUES (?, ?)',
                [this.get('date').getTime(), this.get('details')],
                function(tx, resultSet) {
                    _this.set('id', resultSet.insertId);
                    // accounts はそれぞれ Accounts テーブルに格納
                    // TODO 順にAccountを保存するように変更
                    for (var i = 0; i < _this.get('accounts').length; i++) {
                        _this.get('accounts')[i].transactionId = resultSet.insertId;
                        _this.get('accounts')[i].save(tx, null, onError);
                    }
                    if (onSuccess) { onSuccess(tx, resultSet.insertId, _this); };
                },
                onError
            );
        },

        remove: function(tx, onSuccess, onError) {
            var rowid = this.get('id');
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
        },
        /**
         * モデルのDBへの書き込み・削除の際に呼ばれるメソッド
         */
        sync: function(method, model, option) {
            var sync = this.sync
            , tx = (option || {}).tx;
            if (!tx) {
                this.db.transaction(function(tx) {
                    sync.call(model, method, model, _.defaults(option, {tx: tx}));
                }, function(err) {
                    alert('something failed while accessing database.\n');
                });
                return;
            }

            switch(method) {
            case 'delete':
                this.remove(tx, function(tx) {
                }, function(err) {
                    alert('something failed while removing transactions.\n' + err.message);
                });
                break;
            }
        },
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
                    if (!lastOne || current.get('id') !== lastOne.get('id')) {
                        results.push(current);
                    } else {
                        current = lastOne;
                    }
                    current.get('accounts').push(new Account(resultSet.rows.item(i)));
                };
                onSuccess(tx, results);
            }, onError);
        }
    });
    return Transaction;
})(this);
