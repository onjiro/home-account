require([
    'jquery',
    'underscore',
    'view/transactionHistory',
    'backbone-websql',
], function($, _, TransactionHistoryView) {
    $(function() {
        Account.items = new AccountItemList();
        // bootstrap の Alert div のテンプレート
        var alertTemplate = _.template($('#alert-template').html())
        , $history = $('#history')
        , currentTransactions = new TransactionList()
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

        // 履歴ビューの生成
        new (TransactionHistoryView.Area.extend({
            innerView: TransactionHistoryView.Row.extend({
                template: _.template($('#history-row-template').html()),
            }),
            el: '#history',
            collection: currentTransactions
        }))();

        // 全体のビューの生成
        new (AppView.extend({
            template: _.template($('#selection-template').html())
        }))({
            el: document,
            collection: currentTransactions,
            accountItems: Account.items,
        });

        // 初期ロード時に AccountItems を読み込む
        Account.items.fetch();

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
            collection: currentTransactions,
            alertTemplate: alertTemplate,
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
});
