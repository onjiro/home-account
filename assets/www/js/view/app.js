define([
    'backbone',
    'view/transactionHistory',
], function(Backbone, TransactionHistoryView) {
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

            // 履歴ビュー
            new (TransactionHistoryView.Area.extend({
                innerView: TransactionHistoryView.Row.extend({
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
        onSelectItem: function($selection) {
            $selection
                .siblings('[name="item"], [name="opposite-item"]')
                .val($selection.val())
                .toggle($selection.val() === '');
        },
    });
});
