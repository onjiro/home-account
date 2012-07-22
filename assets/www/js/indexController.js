$(function() {
    var db = openDatabase('home-account', '0.0', 'home account', 100000);
    var errorCallback = function(err) {
        alert('something failed while accessing database.', err);
    };
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ACCOUNT (DATE, ITEM, AMOUNT)');
    }, errorCallback, function() {
        console.log('ready to use ACCOUNT table');
    });
    // Account 登録時の動作
    $('#account-entry').bind('submit', function(event){
        var entries = {
            date: new Date(),
            item: $('[name=item]' ,this).val(),
            oppositeItem: $('[name=opposite-item]' ,this).val(),
            amount: $('[name=amount]' ,this).val()
        };
        var account = new Account({
            date: entries.date,
            item: entries.item,
            amount: entries.amount
        });
        var opposite = new Account({
            date: entries.date,
            item: entries.oppositeItem,
            amount: entries.amount
        });
        // trx をオープン、save
        db.transaction(function(tx) {
            // account.save(tx, function() {opposite.save(tx, function() { alert("ok to save!"); })});
            account.save(tx, function() {opposite.save(tx, function(){/* no-op */}); });
        }, errorCallback, function() {
            alert("ok to save!!");
        });
        return false;
    });
});
