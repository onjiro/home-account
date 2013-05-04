define([
    'backbone',
    'view/commonlyUseAccount',
], function(Backbone, CommonlyUseAccountView) {
    return Backbone.View.extend({
        initialize: function() {
            this.collection.on('reset sync', function(collection) {
                collection.each(this.onAdd, this);
            }, this);
        },
        onAdd: function(model) {
            var newView = new CommonlyUseAccountView({ model: model });
            newView.on('selected', function(item) {
                this.model.set({
                    accountItem: item.name,
                    accountItemId: item.id,
                });
            }, this);
            this.$el.append(newView.el);
        },
    });
});

