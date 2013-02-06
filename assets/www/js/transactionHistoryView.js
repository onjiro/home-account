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
            'click .more-history .btn': function(e) { this.collection.fetch(); },
        },
        initialize: function() {
            this.collection.on('add'   , this.add     , this);
            this.collection.on('remove', this.onRemove, this);
            this.collection.on('reset' , this.render  , this);
            this.collection.on('request', function(collection, method, option) {
                if (method === 'read') this.renderLoading(collection, option);
            }, this);

            this.template = _.template($('#history-template').html());
            this.$tbody = this.$el.find('tbody');
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
                this.$tbody.prepend(formatToTableRow(model, this.template)).children(':first-child'):
                this.$tbody.append(formatToTableRow(model, this.template)).children(':last-child');
            if (options.newest) {
                $added.hide().fadeIn();
            }
        },
        onRemove: function(model) {
            this.$tbody.children('[data-model-cid="' + model.cid + '"]').fadeOut(function() { $(this).detach() });
        },
        render: function(collection, options) {
            this.$tbody.empty();
            collection.chain()
                .sortBy(function(model) { return model.id * -1 })
                .each(function(model) {
                    this.$tbody.append(formatToTableRow(model, this.template));
                }, this);
            this.$el
                .find('table').show()
                .siblings().not('h2').hide();
            this.$el.find('.more-history').toggle(!!options.from);
        },
        renderLoading: function(collection, options) {
            this.$el
                .find('.loading').show()
                .siblings().not('h2').hide();
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
