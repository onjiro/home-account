this.Transaction = (function(global) {
    return Backbone.Model.extend({
        // properties
        sqls: {
            delete: 'DELETE FROM Transactions WHERE rowid = <%= id %>',
        },
        hooks: {
            delete: 'DELETE FROM Accounts WHERE transactionId = <%= id %>',
        },

        initialize: function(values) {
            values = values || {};
            this.set({
                id       : values.id,
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
                        _this.get('accounts')[i].save({}, {
                            tx: tx,
                            error: onError,
                        });
                    }
                    if (onSuccess) { onSuccess(tx, resultSet.insertId, _this); };
                },
                onError
            );
        },
    });
})(this);
