require([
    'util',
    'jquery',
    'underscore',
    'view/app',
    'model/accountItem',
    'model/accountItemList',
    'model/transactionList',
], function(util, $, _, AppView, AccountItem, AccountItemList, TransactionList) {
    $(function() {
        var accountItems = new AccountItemList()
        , transactions = new TransactionList()
        , totalAccounts = new TotalAccountList();

        // モデル間の依存関係を設定
        transactions.on('add remove change reset', function() {
            totalAccounts.fetch({ to: new Date(), reset: true });
        });

        // 全体のビューの生成
        new (AppView.extend({
            template: _.template($('#selection-template').html())
        }))({
            el: document,
            collection: transactions,
            accountItems: accountItems,
            totalAccounts: totalAccounts,
        });

        // データ初期ロード
        accountItems.add(new AccountItem({name: '<新規科目>'}));
        accountItems.fetch({remove: false, success: function() {
            transactions.fetch({ from: util.calculateDaysAgo(new Date(), 7) });
        }});
    });
});
