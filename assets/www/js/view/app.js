define([
    'backbone',
    'underscore',
    'view/historyArea',
    'view/historyRow',
    'view/itemOptionView',
], function(Backbone, _, HistoryAreaView, HistoryRowView, ItemOptionView) {
    return Backbone.View.extend({
        initialize: function(options) {
            this.accountItems = this.options.accountItems;
            this.$itemSelection = this.$('[name="item-in-selection"]');
            this.$oppositeSelection = this.$('[name="opposite-item-in-selection"]');

            this.accountItems
                .on('add', this.onAddAccountItems, this)
                .on('select-for-item', function(model) {
                    this.$('[name="item-id"]').val(model.id);
                    this.$('[name="item"]')
                        .val(model.isNew() ? '': model.get('name'))
                        .toggle(model.isNew());
                }, this)
                .on('select-for-opposite-item', function(model) {
                    this.$('[name="opposite-item-id"]').val(model.id);
                    this.$('[name="opposite-item"]')
                        .val(model.isNew() ? '': model.get('name'))
                        .toggle(model.isNew());
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
            this.$itemSelection.append(new ItemOptionView({
                model: accountItem,
                eventName: 'select-for-item',
            }).el);
            this.$oppositeSelection.append(new ItemOptionView({
                model: accountItem,
                eventName: 'select-for-opposite-item',
            }).el);
        },
    });
});
