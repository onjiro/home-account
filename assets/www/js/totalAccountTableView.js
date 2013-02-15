this.TotalAccountTableView = (function(global) {
    var TotalAccountView = Backbone.View.extend({
        initialize: function() {
            this.$template = _.template($('#total-account-template').html());
            this.collection.on('add', this.add, this);
            this.collection.on('change', this.update, this);
            this.collection.on('reset', this.render, this);
            this.render();
        },
        add: function(model, collections, options) {
            this.$el.append(this.$template(model.attributes));
        },
        update: function(model, collections, options) {
            this.$('[data-item="' + model.get('item') + '"]')
                .replaceWith(this.$template(model.attributes));
        },
        render: function(collections, options) {
            var _this = this;
            this.$el.empty();
            this.collection.forEach(function(model) {
                this.add(model, collections, options);
            }, this);
        }
    });
    return TotalAccountView;
})(this);
