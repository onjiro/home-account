this.Account = (function(global) {
    var Constructor = function(values) {
        values = values || {}
        this.item = values.item;
        this.amount = values.amount || 0;
        this.date = values.date || new Date();
        this.type = values.type || 'credit';
    }

    Constructor.prototype.save = function(tx, onSuccess, onError) {
        tx.executeSql(
            'INSERT INTO ACCOUNTS (DATE, ITEM, AMOUNT, TYPE) VALUES (?, ?, ?, ?)',
            [this.date, this.item, this.amount, this.type],
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
    
    Constructor.init = function(db) {
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ACCOUNTS (DATE, ITEM, AMOUNT, TYPE)');
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        }, function() {
            console.log('ready to use ACCOUNTS table');
        });
    }
    return Constructor;
})(this);
