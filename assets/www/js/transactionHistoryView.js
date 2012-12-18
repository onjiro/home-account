this.TransactionHistoryView = (function(global) {
    var TransactionHistoryView = Backbone.View.extend({
        events: {
            // 支出の削除
            "click tr": function(e) {
                var $this = $(e.currentTarget)
                , currentTransactions = this.collection;
                if (!window.confirm('指定の履歴を削除します。')) {
                    return;
                }
                db.transaction(function(tx) {
                    currentTransactions.getByCid($this.data('model-cid')).remove(tx, function(tx) {
                        $this.fadeOut(function() { $this.detach() });
                    }, function(err) {
                        alert('something failed while removing transactions.\n' + err.message);
                    });
                });
            },
        },
        initialize: function() {
            this.collection.on('add', this.add, this);

            this.template = _.template($('#history-template').html());
        },
        add: function(model, collections, options) {
            $added = (options.index === 0) ?
                this.$el.prepend(formatToTableRow(model, this.template)).children(':first-child'):
                this.$el.append(formatToTableRow(model, this.template)).children(':last-child');
            if (options.newest) {
                $added.hide().fadeIn();
            }
        }
    })
    , formatToTableRow = function(transaction, template) {
        var accounts = transaction.get('accounts')
        , debitAccounts  = _.where(accounts, {type: 'debit'})
        , creditAccounts = _.where(accounts, {type: 'credit'});
        return template({
            cid        : transaction.cid,
            date       : transaction.get('date'),
            items      : _.map(debitAccounts, function(account) { return account.item }),
            amount     : _.reduce(debitAccounts, function(memo, item) { return memo + item.amount }, 0),
            creditItems: _.map(creditAccounts, function(account) { return account.item }),
        });
    }

    return TransactionHistoryView;
})(this);
