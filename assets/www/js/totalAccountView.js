this.TotalAccountView = (function(global) {
    var TotalAccountView = Backbone.View.extend({
        initialize: function() {
            this.collection.on('add', this.add, this)
        },
        add: function(model, collections, options) {
            this.$el.append(
                '<tr' +
                    '  data-item="' + model.item + '"' +
                    '  data-type="' + model.type + '"' +
                    '  data-amount="' + model.amount + '"' +
                    '>' +
                    '  <td><a href="#inventory-entry">' + model.item + '</a></td>' +
                    '  <td>' + model.type + '</td>' +
                    '  <td>' + model.amount + '</td>' +
                    '</tr>'
            );
        }
    });
    return TotalAccountView;
})(this);