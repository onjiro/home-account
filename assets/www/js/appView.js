this.AppView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change [name="item-in-selection"],[name="opposite-item-in-selection"]': function(e) { this.onSelectItem($(e.srcElement)); },
        },
        initialize: function(options) {
            var _this = this;
            this.selectionTemplate = _.template($('#selection-template').html());
            this.$select = _this.$el.find('[name="item-in-selection"], [name="opposite-item-in-selection"]');

            this.collection.on('reset', function() {
                this.$('#history')
                    .children('.loading').hide().end()
                    .children('table').show();
            }, this);

            options.accountItems
                .on('add', this.onAddAccountItems, this)
                .on('reset', function(collection) {
                    collection.each(_this.onAddAccountItems, this);
                    _this.onSelectItem(_this.$select);
                }, this);
        },
        onAddAccountItems: function(accountItem) {
            this.$select.append(this.selectionTemplate({
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
