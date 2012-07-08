var global = this;
this.Account = function(values) {
    values = values || {}
    this.item = values.item;
    this.amount = values.amount || 0;
    this.date = values.date || new Date();
}

this.Account.prototype.save = function(tx, onSuccess, onError) {
    tx.executeSql(
        'INSERT INTO ACCOUNT (DATE, ITEM, AMOUNT) VALUES (?, ?, ?)',
        [this.date, this.item, this.amount],
        function(tx, resultSet) {
            onSuccess(tx, resultSet.insertId);
        },
        onError
    )
}

this.Account.find = function(tx, onSuccess, onError) {
    tx.executeSql('SELECT * FROM ACCOUNT', [], function(tx, resultSet) {
        var results = [];
        for (var i = 0; i < resultSet.rows.length; i++) {
            results.push(new global.Account(resultSet.rows.item(i)));
        };
        onSuccess(tx, results);
    }, onError);
}
