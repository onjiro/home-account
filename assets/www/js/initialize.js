var db = openDatabase('home-account', '', 'home account', 100000);
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
        Transaction.init(db);
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
        var sql = 'ALTER TABLE Accounts ADD COLUMN transactionId INTEGER';
        tx.executeSql(sql);
    });
    m.migration(5, function(tx) {
        var sql = [
            'UPDATE Accounts',
            'SET transactionId =',
            '  (SELECT rowid',
            '  FROM Transactions',
            '  WHERE Transactions.date = Accounts.date)'
        ].join(' ');
        tx.executeSql(sql);
    });
    m.doIt();
});
