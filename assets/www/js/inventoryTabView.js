this.InventoryTabView = (function(global) {
    var createFilteredAccounts = function(all, accepts) {
        return all.filter(function(account) {
            return (accepts) ?
                _.contains(accepts, account.get('itemClassification')):
                true;
        });
    };

    return Backbone.View.extend({
        events: {
            'click .js-show-all, .js-show-limited': function(e) { this.onClickFilterButton($(e.target)); },
            'click tbody a': function(e) {
                this.$('#inventory-entry [name="item"]').val($(e.target).closest('tr').data('item'));
            },
        },

        initialize: function() {
            this.collection.filterWith = function(classifications) {
                var totalAccounts = new Backbone.Collection(createFilteredAccounts(this, classifications));
                this.on('add', function(model, collection, options) {
                    if ((!classifications) || _.contains(classifications, model.get('itemClassification'))) {
                        totalAccounts.add(model);
                    }
                }, this);
                this.on('reset', function(collection, options) {
                    totalAccounts.reset(_.map(createFilteredAccounts(this, classifications), function(model) { return model.attributes; }));
                }, this);
                return totalAccounts;
            };
            this.onClickFilterButton($(this.$('[default]')));
        },
        onClickFilterButton: function($button) {
            if (this.tableView) this.tableView.remove();
            this.tableView = new TotalAccountTableView({
                el: this.$('table').append('<tbody/>').children('tbody'),
                collection: this.collection.filterWith(eval($button.data('accepts'))),
            });
            $button.hide().siblings().show();
        },

    });
})(this);
