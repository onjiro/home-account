this.TransactionHistoryRowView = (function() {
    return Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click': function(e) {
                new TransactionDetailView({ model: this.model });
            },
            "touchstart td": 'hover',
            "mouseover td" : 'hover',
            'touchend td'  : 'hout',
            'mouseout td'  : 'hout',
        },
        initialize: function() {
            this.template = _.template($('#history-row-template').html());
            this.model.on('destroy', function() {
                this.$el.fadeOut(this.remove);
            }, this);
            this.render();
        },
        render: function() {
            this.$el.empty().append(this.template(this.model.attributes));
        },
        hover: function(e) {
            this.$el.addClass('hover');
            setTimeout(_.bind(function() { this.$el.removeClass('hover'); }, this), 1000);
        },
        hout: function(e) {
            this.$el.removeClass('hover');
        },
    });
})();
this.TransactionHistoryView = (function(global) {
    var TransactionHistoryView = Backbone.View.extend({
        events: {
            'click .more-history .btn': function(e) { this.collection.fetch(); },
        },
        initialize: function() {
            this.collection
                .on('add'   , this.add     , this)
                .on('reset' , this.render  , this)
                .on('request', function(collection, method, option) {
                    if (method === 'read') this.renderLoading(collection, option);
                }, this);

            this.template = _.template($('#history-template').html());
            this.$tbody = this.$('tbody');
        },
        add: function(model, collections, options) {
            new TransactionHistoryRowView({ model: model }).$el
                .fadeIn().prependTo(this.$tbody);
        },
        render: function(collection, options) {
            this.$tbody.empty();
            collection.chain()
                .sortBy(function(model) { return model.id * -1 })
                .each(function(model) {
                    this.$tbody.append(new TransactionHistoryRowView({ model: model }).el);
                }, this);
            this.$('table').show().siblings().hide();
            this.$el.find('.more-history').toggle(!!options.from);
        },
        renderLoading: function(collection, options) {
            this.$('.loading').show().siblings().hide();
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
