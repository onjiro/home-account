this.AccountItem = (function(global) {
    return Backbone.Model.extend({
        /**
         * @override Backbone.Model#defaults
         */
        defaults: {
            name: 'no-name',
            classification: '流動資産',
        },
        /**
         * @override Backbone.Model#sync
         */
        sync: function(method, model, options) {
            var options = (options || {}),
            tx = options.tx,
            success = function(tx, resultSet) {
                if (method === 'create') model.set('id', resultSet.insertId);
                if (options.success) options.success(model, resultSet, options);
                model.trigger('sync', model, resultSet, options);
            },
            error = function(err) {
                if (options.error) options.error(model, err, options);
                model.trigger('error', model, err, options);
            };

            switch(method) {
            case 'create':
                tx.executeSql(
                    'INSERT INTO AccountItems (name, classificationId) VALUES (?, '
                        + '(SELECT rowid FROM AccountItemClassifications WHERE name = ?)'
                        + ')',
                    [model.get('name'), model.get('classification')],
                    success,
                    error);
                break;
            case 'update':
                tx.executeSql(
                    'UPDATE AccountItems SET classificationId = '
                        + '(SELECT rowid FROM AccountItemClassifications WHERE name = ?) '
                        + 'WHERE rowid = ?',
                    [model.get('classification'), model.id],
                    success,
                    error);
                break;
            };
        },
    });
})(this);
