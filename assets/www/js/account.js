this.Account = (function(global) {
    var Constructor = function(values) {
        values = values || {}
        this.item = values.item;
        this.amount = values.amount || 0;
        this.date = values.date || new Date();
    }

    Constructor.prototype.save = function(tx, onSuccess, onError) {
        tx.executeSql(
            'INSERT INTO ACCOUNTS (DATE, ITEM, AMOUNT) VALUES (?, ?, ?)',
            [this.date, this.item, this.amount],
            function(tx, resultSet) {
                if (onSuccess) { onSuccess(tx, resultSet.insertId); };
            },
            onError
        )
    }

    Constructor.find = function(tx, onSuccess, onError) {
        tx.executeSql('SELECT * FROM ACCOUNTS', [], function(tx, resultSet) {
            var results = [];
            for (var i = 0; i < resultSet.rows.length; i++) {
                results.push(new Constructor(resultSet.rows.item(i)));
            };
            onSuccess(tx, results);
        }, onError);
    }
    return Constructor;
})(this);
