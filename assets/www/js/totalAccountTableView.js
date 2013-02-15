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
            var $row = this.$el.children('[data-item="' + model.get('item') + '"]')
            $row
                .data('type', model.get('type'))
                .data('amount', model.get('amount'))
                .empty()
                .append(
                    '<td>' + model.get('item') + '</td>' +
                        '<td>' + model.get('type') + '</td>' +
                        '<td>' + model.get('amount') + '</td>'
                );
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
