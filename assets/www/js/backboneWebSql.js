(function(global) {
    /**
     * override `Backbone.sync` to use web-sql db
     */
    Backbone.sync = function(method, model, options) {
        var sql, attr, tx = (options || {}).tx;
        if (!tx) {
            Backbone.sync.db.transaction(_.bind(function(tx) {
                Backbone.sync.call(this, method, model, _.defaults(options, {tx: tx}));
            }, this), function(err) {
                alert('something failed while accessing database.\n' + err.message);
            });
            return;
        }

        attr = _.defaults((model.attributes || {}), options);
        sql = _.template(this.sqls[method], attr);
        switch (method) {
        case 'create':
            tx.executeSql(sql, [], _.bind(function(tx, resultSet) {
                this.set('id', resultSet.insertId);
                if ((this.hooks || {})[method]) this.hooks[method].call(this, tx, resultSet);
                if ((options || {}).success) options.success(tx, resultSet);
            }, this));
            break;
        case 'read':
            tx.executeSql(sql, [], _.bind(function(tx, resultSet) {
                var resultArray = [];
                for (var i = 0; i < resultSet.rows.length; i++) {
                    resultArray.push(resultSet.rows.item(i));
                }
                this.reset(this.createFromTable(resultArray), options);
            }, this));
            break;
        case 'delete':
            tx.executeSql(sql, [], _.bind(function() {
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
