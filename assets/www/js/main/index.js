require([
    'jquery',
    'underscore',
    'view/app',
    'model/accountItem',
    'model/accountItemList',
    'model/transactionList',
    'model/totalAccountList',
    'view/totalAccountTable',
    'view/inventoryTab',
    'view/subTotal',
], function($, _, AppView, AccountItem) {
    $(function() {
        accountItems = new AccountItemList();
        var $history = $('#history')
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
    });
});
