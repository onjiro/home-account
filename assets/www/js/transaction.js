this.Transaction = (function(global) {
    var Constructor = function(values) {
        values = values || {};
        this.date     = values.date     || new Date();
        this.accounts = values.accounts || [];
        this.details  = values.details  || "";
    };
    
    Constructor.prototype.save = function(tx, onSuccess, onError) {
        // accounts はそれぞれ Accounts テーブルに格納
        for (var i = 0; i < this.accounts.length; i++) {
            this.accounts[i].save(tx, null, onError);
        }
        // Transactions テーブルに格納
        tx.executeSql(
            'INSERT INTO Transactions (date, details) VALUES (?, ?)',
            [this.date, this.details],
            function(tx, resultSet) {
                if (onSuccess) { onSuccess(tx, resultSet.insertId); };
            },
            onError
        );
    };
    
    return Constructor;
})(this);
