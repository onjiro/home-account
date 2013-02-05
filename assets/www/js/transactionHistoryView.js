this.TransactionHistoryView = (function(global) {
    var TransactionHistoryView = Backbone.View.extend({
        events: {
            "click tr": function(e) {
                var modelCid = $(e.currentTarget).data('model-cid')
                new TransactionDetailView({
                    model: this.collection.getByCid(modelCid),
                });
            },
            "touchstart td": 'hover',
            "mouseover td" : 'hover',
            'touchend td'  : 'hout',
            'mouseout td'  : 'hout',
        },
        initialize: function() {
            this.collection.on('add'   , this.add     , this);
            this.collection.on('remove', this.onRemove, this);
            this.collection.on('reset' , this.render  , this);

            this.template = _.template($('#history-template').html());
        },
        hover: function(e) {
            var $target = $(e.currentTarget).addClass('hover');
            setTimeout(function() { $target.removeClass('hover'); }, 1000);
        },
        hout: function(e) {
            $(e.currentTarget).removeClass('hover');
        },
        add: function(model, collections, options) {
            $added = (options.index === 0) ?
                this.$el.prepend(formatToTableRow(model, this.template)).children(':first-child'):
                this.$el.append(formatToTableRow(model, this.template)).children(':last-child');
            if (options.newest) {
                $added.hide().fadeIn();
            }
        },
        onRemove: function(model) {
            this.$el.children('[data-model-cid="' + model.cid + '"]').fadeOut(function() { $(this).detach() });
        },
        render: function(collection, options) {
            collection.chain()
                .sortBy(function(model) { return model.id * -1 })
                .each(function(model) {
                    this.$el.append(formatToTableRow(model, this.template));
                }, this);
        },
    })
    , formatToTableRow = function(transaction, template) {
        var accounts = transaction.get('accounts')
        , debitAccounts  = _.where(accounts, {type: 'debit'});
        return template({
            cid        : transaction.cid,
            date       : transaction.get('date'),
            items      : _.map(debitAccounts, function(account) { return account.item }),
            amount     : _.reduce(debitAccounts, function(memo, item) { return memo + item.amount }, 0),
        });
    }

    return TransactionHistoryView;
})(this);
