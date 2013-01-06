this.AccountItem = (function(global) {
    return Backbone.Model.extend({
        /**
         * @override Backbone.Model#defaults
         */
        defaults: {
            name: 'no-name',
            classificationId: 1,
        },
        /**
         * @override Backbone.Model#sync
         */
        sync: function(method, model, options) {
            var options = (options || {}),
            tx = options.tx,
            success = function(tx, resultSet) {
                model.set('id', resultSet.insertId);
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
                    'INSERT INTO AccountItems (name, classificationId) VALUES (?, ?)',
                    [model.get('name'), model.get('classificationId')],
                    success,
                    error);
                break;
            };
        },
    });
})(this);
