this.Account = (function(global) {
    var Constructor = function(values) {
        values = values || {}
        this.transactionId = values.transactionId;
        this.item = values.item;
        this.amount = (values.amount) ? parseInt(values.amount): 0;
        this.date = new Date(values.date) || new Date();
        this.type = values.type || 'credit';
    }

    Constructor.prototype.doSave = function(tx, onSuccess, onError) {
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
            if (onSuccess) { onSuccess(tx, resultSet.insertId); };
        }, onError)
    }

    Constructor.prototype.save = function(tx, onSuccess, onError) {
        var _this = this,
        accountItems = Constructor.items.where({name: this.item});
        if (accountItems.length === 0) {
            Constructor.items.create({name: this.item}, {
                tx: tx,
                success: function(model) {
                    _this.save(tx, onSuccess, onError);
                },
                error: onError,
            });
        } else {
            this.itemId = accountItems[0].get('id');
            this.doSave(tx, onSuccess, onError);
        }
    }

    return Constructor;
})(this);
