$(function() {
    var db = openDatabase('home-account', '', 'home account', 100000);
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
    
    // submit 時に勘定と反対勘定を同時に登録する
    $('#account-entry').bind('submit', function(event){
        // 画面に入力された情報を取得
        var entries = {
            date: new Date(),
            item: $('[name=item]' ,this).val(),
            oppositeItem: $('[name=opposite-item]' ,this).val(),
            amount: $('[name=amount]' ,this).val(),
            details: null
        };
        // 勘定を登録する
        // account は購入した品目側、通常は資産増加のため、借方（左側）の増加
        // opposite は支払い方法、通常は資産減少のため、貸方（右側）の増加
        var account = new Account({
            date: entries.date,
            item: entries.item,
            amount: entries.amount,
            type: 'debit'
        });
        var opposite = new Account({
            date: entries.date,
            item: entries.oppositeItem,
            amount: entries.amount,
            type: 'credit'
        });
        var accountTransaction = new Transaction({
            date: entries.date,
            details: entries.details,
            accounts: [account, opposite]
        });
        db.transaction(function(tx) {
            accountTransaction.save(tx);
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        }, function() {
            alert("ok to save!!");
        });
        return false;
    });
    
    // 支出履歴の表示
    var $recentAccountsBody = $('#recent-accounts table tbody');
    var addToHistory = function($target, transactions) {
        var format = function(date) {
            return date.getFullYear()
                + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
                + '/' + ('0' + date.getDate()).slice(-2)
                + ' ' + ('0' + date.getHours()).slice(-2)
                + ':' + ('0' + date.getMinutes()).slice(-2);
        }
        for (var i = transactions.length - 1; i >= 0; i--) {
            var item = '', amount = 0, creditItems = [];
            var accounts = transactions[i].accounts;
            for (var j = 0; j < accounts.length; j++) {
                switch (accounts[j].type) {
                case 'debit':
                    item += (item === '') ? '': ', ';
                    item += accounts[j].item;
                    amount += accounts[j].amount;
                    break;
                case 'credit':
                    creditItems.push(accounts[j].item);
                    break
                }
            }
            $target.append([
                '<tr>',
                '  <td>' + format(transactions[i].date) + '</td>',
                '  <td>' + item + '</td>',
                '  <td><span class="label">' + creditItems + '</span></td>',
                '  <td style="text-align: right;">' + amount + '</td>',
                '  <td>' + transactions[i].details + '</td>',
                '</tr>'
            ].join('\n'));
        }
    };
    
    db.transaction(function(tx) {
        Transaction.find(tx, function(tx, transactions) {
            addToHistory($recentAccountsBody, transactions);
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        });
    }, function(err) {
        alert('something failed while accessing database.\n' + err.message);
    });
});
