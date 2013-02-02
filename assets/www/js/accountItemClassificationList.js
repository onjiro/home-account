this.AccountItemClassificationList = (function(global){
    return Backbone.Collection.extend({
        initialize: function(option) {
            this.db = (option || {}).db;
        },
        /**
         * @override Backbone.Colleciton#sync
         */
        sync: function(method, collection, options) {
            var sql, _this, sync,
            tx = (options || {}).tx,
            success = function(tx, resultSet) {
                var i, arr = [];
                for (i = 0; i < resultSet.rows.length; i++) {
                    arr.push(new collection.model(resultSet.rows.item(i)));
                }
                if (options.success) options.success(arr);
                collection.trigger('sync', collection, resultSet, options);
            },
            error = function(err) {
                if (options.error) options.error(collection, err, options);
                collection.trigger('error', collection, err, options);
            };
            if (!tx) {
                _this = this;
                sync = this.sync;
                this.db.transaction(function(tx) {
                    sync.call(_this, method, collection, _.defaults(options, {tx: tx}));
                }, function(err) {
                    alert('something failed while accessing database.\n' + err.message);
                });
                return;
            }

            switch(method) {
            case 'read':
                sql = 'SELECT '
                    +   'rowid AS id,'
                    +   'name,'
                    +   'side '
                    + 'FROM AccountItemClassifications';
                tx.executeSql(sql, [], success, error);
                break;
            };
        },
    });
})(this);
