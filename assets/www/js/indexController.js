$(function() {
    Account.items = new AccountItemList();
    // bootstrap の Alert div のテンプレート
    var alertTemplate = _.template($('#alert-template').html())
    , $history = $('#history')
    , currentTransactions = new TransactionList()
    , historyView = new TransactionHistoryView({
        el: '#history',
        collection: currentTransactions
    })
    , appView = new AppView({
        el: document,
        collection: currentTransactions,
        accountItems: Account.items,
    })
    , totalAccounts = new Backbone.Collection()
    , inventoryTabView = new InventoryTabView({
        el: '#inventory-tab',
        collection: totalAccounts,
    })
    , subtotalView = new SubTotalView({
        el: '#subtotal-tab',
    })
    , calculateDaysAgo = function(targetDate, days) {
        var aWeekAgo = new Date(targetDate.getTime() - days * 24 * 3600 * 1000);
        aWeekAgo.setHours(0);
        aWeekAgo.setMinutes(0);
        aWeekAgo.setSeconds(0);
        aWeekAgo.setMilliseconds(0);
        return aWeekAgo;
    };
    window.withSeparators = function(amount) {
        var num = new String(amount).replace(/,/g, '');
        while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
        return num;
    };
    Backbone.sync.db = db;

    // datepickerの設定
    $('input[type="date"], .datepicker').datepicker({
        dateFormat: 'yy/mm/dd',
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
        var accountTransaction = new Transaction({
            date: entries.date,
            details: entries.details,
            accounts: [
                // 購入した品目側、通常は資産増加のため、借方（左側）の増加
                new Account({
                    date: entries.date,
                    item: entries.item,
                    amount: entries.amount,
                    type: 'debit'
                }),
                // 支払い方法、通常は資産減少のため、貸方（右側）の増加
                new Account({
                    date: entries.date,
                    item: entries.oppositeItem,
                    amount: entries.amount,
                    type: 'credit'
                }),
            ],
        });
        db.transaction(function(tx) {
            accountTransaction.save(tx);
        }, function(err) {
            alert('something failed while accessing database.\n' + err.message);
        }, function() {
            var $alert = $(alertTemplate({
                message: "ok to save!!"
            })).delay(1000).fadeOut();

            $history.prepend($alert, function() { this.remove(); });
            currentTransactions.add(accountTransaction, {at: 0, newest: true});
            _this.reset();
        });
        return false;
    });

    // 初期ロード時に AccountItems を読み込む
    db.transaction(function(tx) {
        Account.items.fetch({tx: tx});
    });

    // 初期ロード時に Transaction を読み込む
    currentTransactions.fetch({ from: calculateDaysAgo(new Date(), 7) });

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
        var form = this;
        db.transaction(function(tx) {
            new TotalAccount({
                amount: $('[name="amount"]', form).val(),
                item:   $('[name="item"]', form).val(),
                type:   $('[name="account-type"]:checked', form).val()
            }).makeInventory(tx, function(tx, total, newTransaction) {
                currentTransactions.add(newTransaction, {at: 0, newest: true});
                form.reset();
            }, function(err) {
                alert('something failed while make an inventory.\n' + err.message);
            });
        });
        return false;
    });

    // エントリータブのビュー
    new EntryTabView({
        el: $('#entry-tab'),
    });

    // 支出登録のビューモデル
    var accounts = {
        debit:  new Backbone.Model({ accountItem: '' }),
        credit: new Backbone.Model({ accountItem: '' }),
    }
    var AccountItemEntryView = Backbone.View.extend({
        initialize: function() {
            this.model.on('change', this.render, this);
            this.render();
        },
        render: function() {
            this.$('input').val(this.model.get('accountItem'));
            return this;
        },
    });
    new AccountItemEntryView({
        el: $('.control-group.item'),
        model: accounts.debit,
    });
    new AccountItemEntryView({
        el: $('.control-group.opposite-item'),
        model: accounts.credit,
    });

    // よく使う勘定科目の表示領域
    var commonlyUseAccounts = {
        debit:  new CommonlyUseAccountItemList(),
        credit: new CommonlyUseAccountItemList(),
    }
    new CommonlyUseAccountAreaView({
        el: $('.debit.commonly-use'),
        model: accounts.debit,
        collection: commonlyUseAccounts.debit,
    });
    new CommonlyUseAccountAreaView({
        el: $('.credit.commonly-use'),
        model: accounts.credit,
        collection: commonlyUseAccounts.credit,
    });

    commonlyUseAccounts.debit.fetch({
        side: 'debit',
        limit: 3,
    });
    commonlyUseAccounts.credit.fetch({
        side: 'credit',
        limit: 3,
    });
});
