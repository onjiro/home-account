this.Transaction = (function(global) {
    return Backbone.Model.extend({
        // properties
        initialize: function(values) {
            values = values || {};
            this.db = values.db;
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

        remove: function(tx, onSuccess, onError) {
            var id = this.id;
            tx.executeSql(
                'DELETE FROM Transactions where rowid = ?',
                [id],
                function(tx, resultSet) {
                    tx.executeSql(
                        'delete from accounts where transactionId = ?',
                        [id],
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
    });
})(this);
