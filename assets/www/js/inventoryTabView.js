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
            'click .js-show-all': function(e) {
                this.tableView.remove();
                this.tableView = new TotalAccountTableView({
                    el: this.$('table').append('<tbody/>').children('tbody'),
                    collection: this.collection.filterWith(),
                });
                $(e.target).hide()
                    .siblings().show();
            },
            'click .js-show-limited': function(e) {
                this.tableView.remove();
                this.tableView = new TotalAccountTableView({
                    el: this.$('table').append('<tbody/>').children('tbody'),
                    collection: this.collection.filterWith(this.options.showClassifications),
                });
                $(e.target).hide()
                    .siblings().show();
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
                    totalAccounts.reset(createFilteredAccounts(this, classifications));
                }, this);
                return totalAccounts;
            };

            this.tableView = new TotalAccountTableView({
                el: this.$('table tbody'),
                collection: this.collection.filterWith(this.options.showClassifications),
            });
        },
    });
})(this);
