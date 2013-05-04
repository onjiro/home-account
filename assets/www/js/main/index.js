require([
    'util',
    'jquery',
    'underscore',
    'view/app',
    'model/accountItem',
    'model/accountItemList',
    'model/transactionList',
    'model/totalAccountList',
    'view/totalAccountTable',
    'view/subTotal',
], function(util, $, _, AppView, AccountItem) {
    $(function() {
        accountItems = new AccountItemList();
        var $history = $('#history')
        , currentTransactions = new TransactionList()
        , totalAccounts = new TotalAccountList()
        , subtotalView = new SubTotalView({
            el: '#subtotal-tab',
        });
        Backbone.sync.db = db;

        // 全体のビューの生成
        new (AppView.extend({
            template: _.template($('#selection-template').html())
        }))({
            el: document,
            collection: currentTransactions,
            accountItems: accountItems,
            totalAccounts: totalAccounts,
        });

        currentTransactions.on('add remove change reset', function() {
            totalAccounts.fetch({ to: new Date(), reset: true });
        });

        // データ初期ロード
        accountItems.add(new AccountItem({name: '<新規科目>'}));
        accountItems.fetch({remove: false, success: function() {
            currentTransactions.fetch({ from: util.calculateDaysAgo(new Date(), 7) });
        }});
    });
});
