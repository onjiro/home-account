var CommonlyUseAccountItemList = (function(global) {
    return Backbone.Collection.extend({
        model: AccountItem,
        sqls: {
            read: ''
                + 'SELECT '
                +   'AccountItems.rowid as id,'
                +   'AccountItems.name as name,'
                +   'AccountItemClassifications.name as classification '
                + 'FROM AccountItems '
                +   'INNER JOIN AccountItemClassifications '
                +     'ON AccountItems.classificationId = AccountItemClassifications.rowid '
                +   'INNER join ('
                +     'SELECT '
                +       'itemId,'
                +       'count(*) as count '
                +     'FROM Accounts '
                +     'WHERE '
                +       'type = ? '
                +     'GROUP BY '
                +       'itemId '
                +   ') AccountCounts ON AccountItems.rowid = AccountCounts.itemId '
                + 'ORDER BY AccountCounts.count DESC '
                + 'LIMIT ?',
        },
        placeholders: {
            read: ['side', 'limit'],
        },
    });
})();

// 初期化処理
$(function() {
    window.CommonlyUseAccountView = Backbone.View.extend({
        template: _.template($('#template-commonly-used-account').html()),
        className: 'commonly-used-account',
        tagName: 'span',
        events: {
            'click a': function(e) {
                e.preventDefault();
                this.trigger('selected', this.model.get('name'));
            },
        },

        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.empty().append(this.template(this.model.attributes));
            return this;
        },
    });

    window.CommonlyUseAccountAreaView = Backbone.View.extend({
        initialize: function() {
            this.collection.on('reset', function(collection) {
                collection.each(this.onAdd, this);
            }, this);
        },
        onAdd: function(model) {
            var newView = new CommonlyUseAccountView({ model: model });
            newView.on('selected', function(accountItem) {
                this.model.set({ accountItem: accountItem });
            }, this);
            this.$el.append(newView.el);
        },
    });

});
