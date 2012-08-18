// テスト用に Account を取り込む
if (this.window === undefined) {
    this.Account = require('./account.js').Account;
}
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
    
    Constructor.find = function(tx, onSuccess, onError) {
        var sql = [
            'SELECT',
            '  Transactions.date as date,',
            '  Transactions.details as details,',
            '  Accounts.item as item,',
            '  Accounts.type as type',
            'FROM',
            '  Transactions INNER JOIN Accounts ',
            '  ON Transactions.date = Accounts.date'
        ].join(' ');
        tx.executeSql(sql, [], function(tx, resultSet) {
            var results = [];
            for (var i = 0; i < resultSet.rows.length; i++) {
                var current = new Constructor(resultSet.rows.item(i));
                var lastOne = (results.length === 0) ? null: results[length - 1];
                if (lastOne === null || current.date.getTime() !== lastOne.date.getTime()) {
                    results.push(current);
                } else {
                    current = lastOne;
                }
                current.accounts.push(new global.Account(resultSet.rows.item(i)));
            };
            onSuccess(tx, results);
        }, onError);
    }
    
    Constructor.init = function(db) {
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Transactions (date, details)');
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        }, function() {
            console.log('ready to use ACCOUNTS table');
        });
    }
    
    return Constructor;
})(this);
