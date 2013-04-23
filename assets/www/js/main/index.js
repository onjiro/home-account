require([
    'jquery',
    'underscore',
    'view/app',
    'model/accountItem',
    'model/accountItemList',
    'model/transactionList',
    'model/totalAccountList',
    'model/commonlyUseAccountItemList',
    'view/entryTab',
    'view/commonlyUseAccount',
    'view/commonlyUseAccountArea',
    'view/totalAccountTable',
    'view/inventoryTab',
    'view/subTotal',
], function($, _, AppView, AccountItem) {
    $(function() {
        accountItems = new AccountItemList();
        // bootstrap の Alert div のテンプレート
        var alertTemplate = _.template($('#alert-template').html())
        , $history = $('#history')
        , currentTransactions = new TransactionList()
        , totalAccounts = new TotalAccountList()
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

        // 全体のビューの生成
        new (AppView.extend({
            template: _.template($('#selection-template').html())
        }))({
            el: document,
            collection: currentTransactions,
            accountItems: accountItems,
        });

        // 棚卸タブビューの生成
        new InventoryTabView({
            el: '#inventory-tab',
            collection: totalAccounts,
            transactions: currentTransactions,
        });

        currentTransactions.on('add remove change reset', function() {
            totalAccounts.fetch({ to: new Date(), reset: true });
        });

        // データ初期ロード
        accountItems.add(new AccountItem({name: '<新規科目>'}));
        accountItems.fetch({remove: false, success: function() {
            currentTransactions.fetch({ from: calculateDaysAgo(new Date(), 7) });
        }});

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
                this.$('input.name').val(this.model.get('accountItem'));
                this.$('input.id').val(this.model.get('accountItemId'));
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
