this.AppView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change [name="item-in-selection"],[name="opposite-item-in-selection"]': function(e) { this.onSelectItem($(e.srcElement)); },
        },
        initialize: function(options) {
            this.$select = this.$('[name="item-in-selection"], [name="opposite-item-in-selection"]');

            options.accountItems
                .on('add', this.onAddAccountItems, this)
                .on('reset', function(collection) {
                    collection.each(this.onAddAccountItems, this);
                    this.onSelectItem(this.$select);
                }, this);
        },
        onAddAccountItems: function(accountItem) {
            this.$select.append(this.template({
                item: accountItem.get('name'),
            }));
        },
        onSelectItem: function($selection) {
            $selection
                .siblings('[name="item"], [name="opposite-item"]')
                .val($selection.val())
                .toggle($selection.val() === '');
        },
    });
})(this);
