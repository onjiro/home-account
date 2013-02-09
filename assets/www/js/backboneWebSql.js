(function(global) {
    var withTransaction = function(context, callback) {
        var orgArgs = Array.prototype.slice.call(arguments, 2);
        Backbone.sync.db.transaction(function(tx) {
            orgArgs.push(tx);
            callback.apply(context, orgArgs);
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        });
    };

    /**
     * override `Backbone.sync` to use web-sql db
     */
    Backbone.sync = function(method, model, options, tx) {
        var sql, attr, placeholders;
        if (!(tx = tx || (options || {}).tx)) {
            return withTransaction(this, Backbone.sync, method, model, options);
        }

        attr = _.defaults((model.attributes || {}), options);
        sql = _.template(this.sqls[method], attr);
        placeholders = _.chain((this.placeholders || {})[method] || [])
            .map(function(placeholder) {
                return _.reduce(placeholder.split('.'), function(memo, param) {
                    return _.result(memo, param);
                }, attr);
            })
            .value();
        switch (method) {
        case 'create':
            tx.executeSql(sql, placeholders, _.bind(function(tx, resultSet) {
                this.set('id', resultSet.insertId);
                if ((this.hooks || {})[method]) this.hooks[method].call(this, tx, resultSet);
                if ((options || {}).success) options.success(this, resultSet, options);
            }, this));
            break;
        case 'read':
            tx.executeSql(sql, placeholders, _.bind(function(tx, resultSet) {
                var resultArray = [];
                for (var i = 0; i < resultSet.rows.length; i++) {
                    resultArray.push(resultSet.rows.item(i));
                }
                if ((options || {}).success) options.success(resultArray, options);
            }, this));
            break;
        case 'update':
            tx.executeSql(sql, placeholders, _.bind(function(tx, resultSet) {
                if (this.onUpdate) this.onUpdate(tx, resultSet);
            }, this));
            break;
        case 'delete':
            tx.executeSql(sql, placeholders, _.bind(function() {
                if ((this.hooks || {})[method]) {
                    var hookSql = _.template(this.hooks[method], attr);
                    tx.executeSql(hookSql, []);
                }
            }, this));
            break;
        default:
            throw new Error('not supported method called!!');
        }
        model.trigger('request', model, method, options);
    }
})(this);
