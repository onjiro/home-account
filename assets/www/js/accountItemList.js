this.AccountItemList = (function(global) {
    return Backbone.Collection.extend({
        model: AccountItem,
        /**
         * @override Backbone.Colleciton#sync
         */
        sync: function(method, collection, options) {
            var sql,
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

            switch(method) {
            case 'read':
                sql = 'SELECT '
                    +   'rowid AS id,'
                    +   'name,'
                    +   'classificationId '
                    + 'FROM AccountItems';
                tx.executeSql(sql, [], success, error);
                break;
            };
        },
    });
})(this);