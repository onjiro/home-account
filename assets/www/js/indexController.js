$(function() {
    // bootstrap の Alert div のテンプレート
    var $alertDiv = $('<div class="alert alert-success"></div>');
    
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
            var $newRow = $(formatToTableRow(accountTransaction));
            $historyBody.prepend($newRow.hide().fadeIn());
            _this.reset();
        });
        return false;
    });
    
    // 支出履歴の表示
    var $history = $('#history');
    var $historyBody = $history.children('table').children('tbody');
    var format = function(date) {
        return date.getFullYear()
            + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
            + '/' + ('0' + date.getDate()).slice(-2)
            + ' ' + ('0' + date.getHours()).slice(-2)
            + ':' + ('0' + date.getMinutes()).slice(-2);
    };
    var formatToTableRow = function(transaction) {
        var item = '', amount = 0, creditItems = [];
        var accounts = transaction.accounts;
        for (var i = 0; i < accounts.length; i++) {
            switch (accounts[i].type) {
            case 'debit':
                item += (item === '') ? '': ', ';
                item += accounts[i].item;
                amount += accounts[i].amount;
                break;
            case 'credit':
                creditItems.push(accounts[i].item);
                break
            }
        }
        return [
            '<tr data-transaction-id="' + transaction.rowid + '">',
            '  <td>' + format(transaction.date) + '</td>',
            '  <td>' + item + '</td>',
            '  <td><span class="label">' + creditItems + '</span></td>',
            '  <td style="text-align: right;">' + amount + '</td>',
            '  <td>' + transaction.details + '</td>',
            '</tr>'
        ].join('\n');
    };
    
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
                $historyBody.append(formatToTableRow(transaction));
            });
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        });
    }, function(err) {
        alert('something failed while accessing database.\n' + err.message);
    });

    db.transaction(function(tx) {
        Account.total(tx, function(tx, accounts) {
            $inventoryBody = $('#inventory-tab tbody');
            $.each(accounts, function(i, account) {
                $inventoryBody.append([
                    '<tr',
                    '  data-item="' + account.item + '"',
                    '  data-type="' + account.type + '"',
                    '  data-amount="' + account.amount + '"',
                    '>',
                    '  <td>' + account.item + '</td>',
                    '  <td>' + account.type + '</td>',
                    '  <td>' + account.amount + '</td>',
                    '</tr>',
                ].join('\n'));
            });
        }, function(err) {
            alert('something failed while accessing Accounts.\n' + err.message);
        });
    }, function(err) {
        alert('something failed while accessing Accounts.\n' + err.message);
    });

    // 棚卸時、選択された科目を科目欄に入力する
    $(document).on('click', '#inventory-tab tbody > tr', function(e) {
        $('#inventory-entry [name="item"]').val($(this).data('item'));
    });

    // 棚卸登録
    $(document).on('submit', '#inventory-entry', function(e) {
        var _this = this;
        db.transaction(function(tx) {
            new TotalAccounts({
                amount: $('[name="amount"]', _this).val(),
                item:   $('[name="item"]', _this).val(),
                type:   $('[name="account-type"]:checked', _this).val()
            }).makeInventory(tx, function(tx, rowId, newTransaction) {
                var $newRow = $(formatToTableRow(newTransaction));
                $historyBody.prepend($newRow.hide().fadeIn());
                _this.reset();
            }, function(err) {
                alert('something failed while make an inventory.\n' + err.message);
            });
        });
        return false;
    });
});
