$(function() {
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
