define([
    'backbone'
], function(Backbone) {
    var Constructor = function(values) {
        values = values || {}
        this.transactionId = values.transactionId;
        this.item = values.item;
        this.amount = (values.amount) ? parseInt(values.amount): 0;
        this.date = new Date(values.date) || new Date();
        this.type = values.type || 'credit';
    },
    insertSql = ''
        + 'INSERT INTO Accounts ('
        +   'transactionId,'
        +   'date,'
        +   'itemId,'
        +   'amount,'
        +   'type'
        + ') VALUES (?, ?, ?, ?, ?)';

    Constructor.prototype.save = function(attribute, options) {
        var _this = this,
        options = options || {},
        doSave = function(accountItem) {
            _this.itemId = accountItem.get('id');
            options.tx.executeSql(insertSql, [
                _this.transactionId,
                _this.date.getTime(),
                _this.itemId,
                _this.amount,
                _this.type
            ], function(tx, rs) {
                if (options.success) options.success(tx, rs.insertId)
            }, options.error);
        },
        item = _.first(Constructor.items.where({name: this.item}));
        // TODO ignore `attribute` now
        if (item) {
            doSave(item);
        } else {
            Constructor.items.create({ name: this.item }, {
                tx:      options.tx,
                success: doSave,
                error:   options.error,
            });
        }
    }

    return Account = Constructor;
});
