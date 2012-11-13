this.TotalAccountView = (function(global) {
    var TotalAccountView = Backbone.View.extend({
        initialize: function() {
            this.collection.on('add', this.add, this)
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
        }
    });
    return TotalAccountView;
})(this);