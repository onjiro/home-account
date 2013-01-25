this.AppView = (function(global) {
    return Backbone.View.extend({
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
            });
        },
    });
})(this);
