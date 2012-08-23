var db = openDatabase('home-account', '', 'home account', 100000);
$(function() {
    var m = new Migrator(db);
    m.migration(1, function(tx) {
        Account.init(db);
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
    m.doIt();
});
