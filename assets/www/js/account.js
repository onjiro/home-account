this.Account = (function(global) {
    var Constructor = function(values) {
        values = values || {}
        this.transactionId = values.transactionId;
        this.item = values.item;
        this.amount = (values.amount) ? parseInt(values.amount): 0;
        this.date = new Date(values.date) || new Date();
        this.type = values.type || 'credit';
    }

    Constructor.prototype.save = function(tx, onSuccess, onError) {
        tx.executeSql([
            'INSERT INTO Accounts (',
            '  transactionId,',
            '  date,',
            '  item,',
            '  amount,',
            '  type',
            ') VALUES (?, ?, ?, ?, ?)'
        ].join(' '), [
            this.transactionId,
            this.date,
            this.item,
            this.amount,
            this.type
        ], function(tx, resultSet) {
            if (onSuccess) { onSuccess(tx, resultSet.insertId); };
        }, onError)
    }

    Constructor.total = function(tx, onSuccess, onError) {
        // TODO 現在の日付を条件に追加するには date の保存形式の変更が必要
        tx.executeSql([
            'SELECT',
            '  item,',
            '  type,',
            '  sum(amount)',
            'FROM',
            '  Account',
            'GROUP BY',
            '  item,',
            '  type'
        ].join(' '), [
            // no query data given
        ], function(tx, resultSet) {
            if (onSuccess) { onSuccess(tx, resultSet); };
        }, onError);
    }
    return Constructor;
})(this);
