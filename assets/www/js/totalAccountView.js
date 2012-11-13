this.TotalAccountView = (function(global) {
    var TotalAccountView = Backbone.View.extend({
        initialize: function() {
            this.collection.on('add', this.add, this);
            this.collection.on('change', this.update, this);
        },
        add: function(model, collections, options) {
            this.$el.append(
                '<tr' +
                    '  data-item="' + model.get('item') + '"' +
                    '  data-type="' + model.get('type') + '"' +
                    '  data-amount="' + model.get('amount') + '"' +
                    '>' +
                    '  <td><a href="#inventory-entry">' + model.get('item') + '</a></td>' +
                    '  <td>' + model.get('type') + '</td>' +
                    '  <td>' + model.get('amount') + '</td>' +
                    '</tr>'
            );
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
        }
    });
    return TotalAccountView;
})(this);