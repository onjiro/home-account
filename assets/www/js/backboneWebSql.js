(function(global) {
    /**
     * override `Backbone.sync` to use web-sql db
     */
    Backbone.sync = function(method, model, options) {
        var sql, tx = (options || {}).tx;
        if (!tx) {
            Backbone.sync.db.transaction(_.bind(function(tx) {
                Backbone.sync.call(this, method, model, _.defaults(options, {tx: tx}));
            }, this), function(err) {
                alert('something failed while accessing database.\n' + err.message);
            });
            return;
        }

        sql = _.template(this.sqls[method], options);
        switch (method) {
        case 'read':
            tx.executeSql(sql, [], _.bind(function(tx, resultSet) {
                var resultArray = [];
                for (var i = 0; i < resultSet.rows.length; i++) {
                    resultArray.push(resultSet.rows.item(i));
                }
                this.reset(this.createFromTable(resultArray), options);
            }, this));
            break;
        default:
            throw new Error('not supported method called!!');
        }
        model.trigger('request', model, method, options);
    }
})(this);
