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
        var data = {
            cid        : transaction.cid,
            date       : _.template('<%= getMonth() %>/<%= getDate() %>', transaction.get('date')),
            items      : [],
            amount     : 0,
            creditItems: [],
        };
        _.each(transaction.get('accounts'), function(account) {
            switch (account.type) {
            case 'debit':
                data.items.push(account.item);
                data.amount += account.amount;
                break;
            case 'credit':
                data.creditItems.push(account.item);
                break;
            }
        });
        return template(data);
    }

    return TransactionHistoryView;
})(this);
