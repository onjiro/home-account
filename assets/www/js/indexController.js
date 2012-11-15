$(function() {
    // bootstrap の Alert div のテンプレート
    var $alertDiv = $('<div class="alert alert-success"></div>')
        .css({
            position:   'absolute',
            marginTop:  '-6.5em',
            width:      '100%',
            padding:    '3em 0',
            textIndent: '1.66em'
        })
    , $history = $('#history')
    , currentTransactions = new Backbone.Collection()
    , historyView = new TransactionHistoryView({
        el: '#history table > tbody',
        collection: currentTransactions
    })
    , totalAccounts = new Backbone.Collection()
    , totalAccountView = new TotalAccountView({
        el: '#inventory-tab table tbody',
        collection: totalAccounts
    });

    // submit 時に勘定と反対勘定を同時に登録する
    $('#account-entry, #account-withdraw').live('submit', function(event){
        var _this = this;
        // 画面に入力された情報を取得
        var dateVal = $('[name=date]', this).val();
        var entries = {
            date: (dateVal) ? new Date(dateVal): new Date(),
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
            $history.prepend(
                $alertDiv
                    .clone()
                    .append("ok to save!!")
                    .delay(1000)
                    .fadeOut(),
                function() {
                    this.remove();
                }
            );
            currentTransactions.add(accountTransaction, {at: 0, newest: true});
            _this.reset();
        });
        return false;
    });

    // 支出の削除
    var $histories = $('tbody > tr', $history);
    $histories.live('click', function(event) {
        var $this = $(this);
        if (!window.confirm('指定の履歴を削除します。')) {
            return;
        }
        db.transaction(function(tx) {
            new Transaction({
                rowid: $this.data('transaction-id')
            }).remove(tx, function(tx) {
                $this.fadeOut(function() { $this.detach() });
            }, function(err) {
                alert('something failed while removing transactions.\n' + err.message);
            });
        });
    });
    
    db.transaction(function(tx) {
        Transaction.find(tx, function(tx, transactions) {
            $.each(transactions.reverse(), function(i, transaction) {
                currentTransactions.add(transaction);
            });
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        });
    }, function(err) {
        alert('something failed while accessing database.\n' + err.message);
    });

    // 初期ロード時に TotalAccount を読み込む
    db.transaction(function(tx) {
        TotalAccount.select({date: new Date()}, tx, function(tx, accounts) {
            totalAccounts.add(accounts);
            
            // backboned model 間の依存 listen 関係を定義
            currentTransactions.on('add change remove', function(model, collection, option) {
                db.transaction(function(tx) {
                    TotalAccount.select({date: new Date()}, tx, function(tx, accounts) {
                        totalAccounts.reset(accounts);
                    });
                });
            });
        }, function(err) {
            alert('something failed on query TotalAccounts.\n' + err.message);
        });
    }, function(err) {
        alert('something failed while accessing Accounts.\n' + err.message);
    });

    // 棚卸時、選択された科目を科目欄に入力qし、フォームに移動する
    $(document).on('click', '#inventory-tab tbody a', function(e) {
        $('#inventory-entry [name="item"]').val($(this).closest('tr').data('item'));
    });

    // 棚卸登録
    $(document).on('submit', '#inventory-entry', function(e) {
        var _this = this;
        db.transaction(function(tx) {
            new TotalAccount({
                amount: $('[name="amount"]', _this).val(),
                item:   $('[name="item"]', _this).val(),
                type:   $('[name="account-type"]:checked', _this).val()
            }).makeInventory(tx, function(tx, total, newTransaction) {
                currentTransactions.add(newTransaction, {at: 0, newest: true});
                _this.reset();
            }, function(err) {
                alert('something failed while make an inventory.\n' + err.message);
            });
        });
        return false;
    });
});
