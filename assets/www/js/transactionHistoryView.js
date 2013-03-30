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
var TransactionHistoryView = (function() {
    return Backbone.View.extend({
        events: {
            'click .more-history .btn': function(e) { this.collection.fetch(); },
        },
        initialize: function() {
            this.collection
                .on('reset' , this.render  , this)
                .on('add', function(model, collections, options) {
                    new TransactionHistoryRowView({ model: model }).$el
                        .fadeIn().prependTo(this.$tbody);
                }, this)
                .on('request', function(collection, method, option) {
                    if (method === 'read') {
                        this.$('.loading').show().siblings().hide();
                    }
                }, this);

            this.$tbody = this.$('tbody');
        },
        render: function(collection, options) {
            this.$tbody.empty()
                .append(this.collection
                        .sortBy(function(model) { return model.id * -1 })
                        .map(function(model) { return new TransactionHistoryRowView({ model: model }).el; }));
            this.$('table').show().end().find('.loading').hide();
            this.$('.more-history').toggle(!!options.from);
        },
    });
})();
