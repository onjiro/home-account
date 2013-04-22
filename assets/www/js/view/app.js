define([
    'backbone',
    'underscore',
    'view/historyArea',
    'view/historyRow',
], function(Backbone, _, HistoryAreaView, HistoryRowView) {
    var ItemRowView = Backbone.View.extend({
        tagName: 'option',
        events: {
            'select': function(e) {
                this.model.trigger(this.eventName, this.model)
            },
        },
        initialize: function() {
            this.eventName = this.options.eventName;
            this.render();
        },
        render: function() {
            this.$el.append(this.model.get('name'));
            return this;
        },
    });

    return Backbone.View.extend({
        initialize: function(options) {
            this.accountItems = this.options.accountItems;
            this.$select = this.$('[name="item-in-selection"], [name="opposite-item-in-selection"]');
            this.$itemSelection = this.$('[name="item-in-selection"]');
            this.$oppositeSelection = this.$('[name="opposite-item-in-selection"]');

            this.accountItems
                .on('add', this.onAddAccountItems, this)
                .on('reset', function(collection) {
                    collection.each(this.onAddAccountItems, this);
                    this.onSelectItem(this.$select);
                }, this)
                .on('select-for-item', function(model) {
                    this.$('[name="item"]')
                        .val(model.get('name'))
                        .toggle(!model.id);
                }, this)
                .on('select-for-opposite-item', function(model) {
                    this.$('[name="opposite-item"]')
                        .val(model.get('name'))
                        .toggle(!model.id);
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
            this.$itemSelection.append(new ItemRowView({
                model: accountItem,
                eventName: 'select-for-item',
            }).el);
            this.$oppositeSelection.append(new ItemRowView({
                model: accountItem,
                eventName: 'select-for-opposite-item',
            }).el);
        },
    });
});
