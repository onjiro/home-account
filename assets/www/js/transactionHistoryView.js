this.TransactionHistoryView = (function(global) {
    var TransactionHistoryView = Backbone.View.extend({
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
