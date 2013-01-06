this.Account = (function(global) {
    var Constructor = function(values) {
        values = values || {}
        this.transactionId = values.transactionId;
        this.item = values.item;
        this.amount = (values.amount) ? parseInt(values.amount): 0;
        this.date = new Date(values.date) || new Date();
        this.type = values.type || 'credit';
    }

    Constructor.prototype.doSave = function(attribute, options) {
        var options = options || {},
        tx = options.tx;
        tx.executeSql([
            'INSERT INTO Accounts (',
            '  transactionId,',
            '  date,',
            '  itemId,',
            '  amount,',
            '  type',
            ') VALUES (?, ?, ?, ?, ?)'
        ].join(' '), [
            this.transactionId,
            this.date.getTime(),
            this.itemId,
            this.amount,
            this.type
        ], function(tx, resultSet) {
            if (options.success) options.success(tx, resultSet.insertId);
        }, options.error)
    }

    Constructor.prototype.save = function(attribute, options) {
        var _this = this,
        options = options || {},
        tx = options.tx,
        success = options.success,
        error = options.error,
        item = _.first(Constructor.items.where({name: this.item}));
        // TODO ignore `attribute` now
        if (!item) {
            Constructor.items.create({name: this.item}, {
                tx: tx,
                success: function(model) { _this.save({}, options) },
                error: error,
            });
        } else {
            this.itemId = item.get('id');
            this.doSave(attribute, options);
        }
    }

    return Constructor;
})(this);
