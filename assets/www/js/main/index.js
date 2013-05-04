require([
    'util',
    'jquery',
    'underscore',
    'view/app',
    'model/accountItem',
    'model/accountItemList',
    'model/transactionList',
], function(util, $, _, AppView, AccountItem) {
    Backbone.sync.db = db;
    $(function() {
        var accountItems = new AccountItemList()
        , currentTransactions = new TransactionList()
        , totalAccounts = new TotalAccountList();

        // モデル間の依存関係を設定
        currentTransactions.on('add remove change reset', function() {
            totalAccounts.fetch({ to: new Date(), reset: true });
        });

        // 全体のビューの生成
        new (AppView.extend({
            template: _.template($('#selection-template').html())
        }))({
            el: document,
            collection: currentTransactions,
            accountItems: accountItems,
            totalAccounts: totalAccounts,
        });

        // データ初期ロード
        accountItems.add(new AccountItem({name: '<新規科目>'}));
        accountItems.fetch({remove: false, success: function() {
            currentTransactions.fetch({ from: util.calculateDaysAgo(new Date(), 7) });
        }});
    });
});
