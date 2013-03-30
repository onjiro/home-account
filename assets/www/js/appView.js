this.AppView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change [name="item-in-selection"],[name="opposite-item-in-selection"]': function(e) { this.onSelectItem($(e.srcElement)); },
        },
        initialize: function(options) {
            this.template = _.template($('#selection-template').html());
            this.$select = this.$('[name="item-in-selection"], [name="opposite-item-in-selection"]');

            this.collection.on('reset', function() {
                this.$('#history')
                    .children('.loading').hide().end()
                    .children('table').show();
            }, this);

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
