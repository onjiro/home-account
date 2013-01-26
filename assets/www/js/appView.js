this.AppView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change [name="item-in-selection"],[name="opposite-item-in-selection"]': function(e) { this.onSelectItem($(e.srcElement)); },
        },
        initialize: function(options) {
            var _this = this
            , selectionTemplate = _.template($('#selection-template').html());
            this.collection.on('reset', function() {
                this.$('#history')
                    .children('.loading').hide().end()
                    .children('table').show();
            }, this);
            options.accountItems.on('reset', function(collection) {
                var $select = _this.$el.find('[name="item-in-selection"], [name="opposite-item-in-selection"]');
                collection.each(function(model) {
                    $select.append(selectionTemplate({
                        item: model.get('name'),
                    }));
                });
                _this.onSelectItem($select);
            });
        },
        onSelectItem: function($selection) {
            $selection
                .siblings('[name="item"], [name="opposite-item"]')
                .val($selection.val());
        },
    });
})(this);
