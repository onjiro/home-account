var db = openDatabase('home-account', '', 'home account', 300000);
$(function() {
    var m = new Migrator(db);
    m.migration(1, function(tx) {
        tx.executeSql([
            'CREATE TABLE IF NOT EXISTS Accounts (',
            '  date,',
            '  item,',
            '  amount,',
            '  type',
            ')'
        ].join(' '));
    });
    m.migration(2, function(tx) {
        tx.executeSql([
            'CREATE TABLE IF NOT EXISTS Transactions (',
            '  date,',
            '  details',
            ')'
        ].join(' '));
    });
    m.migration(3, function(tx) {
        var sql = 'SELECT DISTINCT date FROM Accounts ';
        tx.executeSql(sql, [], function(tx, resultSet) {
            for (var i = 0; i < resultSet.rows.length; i++) {
                new Transaction({
                    date: resultSet.rows.item(i).date,
                }).save(tx);
            }
        });
    });
    m.migration(4, function(tx) {
        tx.executeSql([
            'ALTER TABLE Accounts',
            'ADD COLUMN',
            '  transactionId INTEGER'
        ].join(' '));
    });
    m.migration(5, function(tx) {
        tx.executeSql([
            'UPDATE Accounts',
            'SET transactionId =',
            '  (SELECT rowid',
            '  FROM Transactions',
            '  WHERE Transactions.date = Accounts.date)'
        ].join(' '));
    });
    m.migration(6, function(tx) {
        tx.executeSql(
            'SELECT rowid, date FROM Transactions', [],
            function(tx, resultSet) {
                var i, item;
                for (var i = 0; i < resultSet.rows.length; i++) {
                    item = resultSet.rows.item(i)
                    tx.executeSql(
                        'UPDATE Transactions SET date = ?  WHERE rowid = ?',
                        [new Date(item.date).getTime(), item.rowid]
                    );
                }
            }
        );
    });
    m.migration(7, function(tx) {
        tx.executeSql(
            'SELECT rowid, date FROM Accounts', [],
            function(tx, resultSet) {
                var i, item;
                for (var i = 0; i < resultSet.rows.length; i++) {
                    item = resultSet.rows.item(i)
                    tx.executeSql(
                        'UPDATE Accounts SET date = ?  WHERE rowid = ?',
                        [new Date(item.date).getTime(), item.rowid]
                    );
                }
            }
        );
    });
    m.migration(8, function(tx) {
        tx.executeSql('ALTER TABLE Accounts ADD COLUMN itemId INTEGER');
        tx.executeSql('CREATE TABLE IF NOT EXISTS AccountItems (name, classificationId)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS AccountItemClassifications (name, side)');
    });
    m.migration(9, function(tx) {
        _.each([
            ['流動資産'      , 'debit'],
            ['固定資産'      , 'debit'],
            ['繰延資産'      , 'debit'],
            ['流動負債'      , 'credit'],
            ['固定負債'      , 'credit'],
            ['純資産'        , 'credit'],
            ['収益'          , 'credit'],
            ['費用'          , 'debit'],
            ['固定資産評価損', 'debit'],
            ['その他借方'    , 'debit'],
            ['その他貸方'    , 'credit']
        ], function(initialData) {
            tx.executeSql('INSERT INTO AccountItemClassifications (name, side) VALUES (?, ?)', initialData);
        });
    });
    m.migration(10, function(tx) {
        tx.executeSql('SELECT DISTINCT(item) FROM Accounts', [], function(tx, resultSet) {
            var i, itemName;
            for (var i = 0; i < resultSet.rows.length; i++) {
                itemName = resultSet.rows.item(i).item;
                tx.executeSql('INSERT INTO AccountItems (name, classificationId) VALUES (?, ?)', [itemName, 1]);
            }
        });
    });
    m.doIt();
});
