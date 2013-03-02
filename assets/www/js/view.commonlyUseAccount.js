$(function() {
    window.CommonlyUseAccountView = Backbone.View.extend({
        template: _.template($('#template-commonly-used-account').html()),
        className: 'commonly-used-account',
        tagName: 'span',
        events: {
            'click a': function(e) {
                e.preventDefault();
                this.trigger('selected', this.model.get('name'));
            },
        },

        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.empty().append(this.template(this.model.attributes));
            return this;
        },
    });

    window.CommonlyUseAccountAreaView = Backbone.View.extend({
        initialize: function() {
            this.collection.on('reset', function(collection) {
                collection.each(this.onAdd, this);
            }, this);
        },
        onAdd: function(model) {
            var newView = new CommonlyUseAccountView({ model: model });
            newView.on('selected', function(accountItem) {
                this.model.set({ accountItem: accountItem });
            }, this);
            this.$el.append(newView.el);
        },
    });

});
