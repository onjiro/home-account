define([
    'backbone',
], function(Backbone) {
    return Backbone.View.extend({
        // innerView to be set using `extend`
        events: {
            'click .more-history .btn': function(e) { this.collection.fetch(); },
        },
        initialize: function() {
            this.collection
                .on('reset sync' , this.render  , this)
                .on('add', function(model, collections, options) {
                    (new this.innerView({ model: model })).$el
                        .fadeIn().prependTo(this.$tbody);
                }, this)
                .on('request', function(collection, method, option) {
                    if (method === 'read') {
                        this.$('.loading').show().siblings().hide();
                    }
                }, this);

            this.$tbody = this.$('tbody');
        },
        render: function(model, collection, options) {
            this.$tbody.empty()
                .append(this.collection
                        .sortBy(function(model) { return model.id * -1 })
                        .map(function(model) { return (new this.innerView({ model: model })).el; }, this));
            this.$('table').show().end().find('.loading').hide();
            this.$('.more-history').toggle(!!options.from);
        },
    });
});
