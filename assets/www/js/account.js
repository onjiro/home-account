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
        var _this = this;
        tx.executeSql(
            'SELECT rowid FROM AccountItems WHERE name = ?',
            [this.item],
            function(tx, resultSet) {
                if (resultSet.rows.length === 0) {
                    _this.saveNewItem(tx, function(tx, resultSet) {
                        _this.save(tx, onSuccess, onError);
                    }, onError);
                } else {
                    _this.itemId = resultSet.rows.item(0).rowid;
                    _this.doSave(tx, onSuccess, onError);
                }
            }
        );
    }

    Constructor.prototype.saveNewItem = function(tx, onSuccess, onError) {
        tx.executeSql(
            'INSERT INTO AccountItems (name, classificationId) VALUES (?, 1)',
            [this.item],
            onSuccess,
            onError
        );
    }

    return Constructor;
})(this);
