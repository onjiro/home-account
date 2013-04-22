define([
    'backbone',
    'view/historyArea',
    'view/historyRow',
], function(Backbone, HistoryAreaView, HistoryRowView) {
    return Backbone.View.extend({
        events: {
            'change [name="item-in-selection"]': function(e) {
                var item = this.accountItems.findWhere({name: $(e.target).val()});
                item.trigger('select-for-item', item);
            },
            'change [name="opposite-item-in-selection"]': function(e) {
                var item = this.accountItems.findWhere({name: $(e.target).val()});
                item.trigger('select-for-opposite-item', item);
            },
        },
        initialize: function(options) {
            this.accountItems = this.options.accountItems;
            this.$select = this.$('[name="item-in-selection"], [name="opposite-item-in-selection"]');

            this.accountItems
                .on('add', this.onAddAccountItems, this)
                .on('reset', function(collection) {
                    collection.each(this.onAddAccountItems, this);
                    this.onSelectItem(this.$select);
                }, this)
                .on('select-for-item', function(model) {
                    this.$('[name="item"]')
                        .val(model.get('name'))
                        .toggle(model.id);
                }, this)
                .on('select-for-opposite-item', function(model) {
                    this.$('[name="opposite-item"]')
                        .val(model.get('name'))
                        .toggle(model.id);
                }, this);

            // 履歴ビュー
            new (HistoryAreaView.extend({
                innerView: HistoryRowView.extend({
                    template: _.template($('#history-row-template').html()),
                }),
            }))({
                el: this.$('#history'),
                collection: this.collection,
            });
        },
        onAddAccountItems: function(accountItem) {
            this.$select.append(this.template({
                item: accountItem.get('name'),
            }));
        },
    });
});
