this.TotalAccountView = (function(global) {
    var TotalAccountView = Backbone.View.extend({
        initialize: function() {
            this.collection.on('add', this.add, this);
            this.collection.on('change', this.update, this);
            this.collection.on('reset', this.render, this);

            this.$tbody = this.$('table tbody');
        },
        add: function(model, collections, options) {
            this.$tbody.append(
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
            var $row = this.$tbody.children('[data-item="' + model.get('item') + '"]')
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
            this.$tbody.empty();
            this.collection.forEach(function(model) {
                this.add(model, collections, options);
            }, this);
        }
    });
    return TotalAccountView;
})(this);
