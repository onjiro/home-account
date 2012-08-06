$(function() {
    var db = openDatabase('home-account', '0.1', 'home account', 100000);
    Account.init(db);
    
    // submit 時に勘定と反対勘定を同時に登録する
    $('#account-entry').bind('submit', function(event){
        // 画面に入力された情報を取得
        var entries = {
            date: new Date(),
            item: $('[name=item]' ,this).val(),
            oppositeItem: $('[name=opposite-item]' ,this).val(),
            amount: $('[name=amount]' ,this).val(),
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
        db.transaction(function(tx) {
            account.save(tx, function() {opposite.save(tx);});
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        }, function() {
            alert("ok to save!!");
        });
        return false;
    });
    
    // 支出履歴の表示
    var sampleAccounts = [
        new Account({
            date: new Date('2012/07/11 18:30'),
            item: '表示例',
            amount: 8000,
            type: 'debit'
        }),
        new Account({
            date: new Date(),
            item: '表示例',
            amount: 8000,
            type: 'credit'
        })
    ];
    var $recentAccountsBody = $('#recent-accounts table tbody');
    var addToHistory = function($target, accounts) {
        var format = function(date) {
            return date.getFullYear()
                + '/' + ('0' + date.getMonth()).slice(-2)
                + '/' + ('0' + date.getDate()).slice(-2)
                + ' ' + ('0' + date.getHours()).slice(-2)
                + ':' + ('0' + date.getMinutes()).slice(-2);
        }
        var i;
        for (i = 0; i < accounts.length; i++) {
            $target.append([
                '<tr>',
                '  <td>' + format(accounts[i].date) + '</td>',
                '  <td>' + accounts[i].item + '</td>',
                '  <td>' + accounts[i].amount + '</td>',
                '  <td>' + accounts[i].type + '</td>',
                '</tr>'
            ].join('\n'));
        }
    };
    
    db.transaction(function(tx) {
        Account.find(tx, function(tx, accounts) {
            addToHistory($recentAccountsBody, accounts);
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        });
    }, function(err) {
        alert('something failed while accessing database.\n' + err.message);
    });
});
