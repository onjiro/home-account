/**
 * AccountItemを設定するためのビュー
 *
 * el, collectionをオブジェクトの生成時に与えること。
 */
AccountItemConfigureView = (function(global) {
    return Backbone.View.extend({
        initialize: function() {
            this.rowTemplate = _.template($('#account-item-template').html());
            this.$tableBody = this.$('tbody');

            this.collection.on('reset', this.render, this);
        },
        render: function() {
            this.collection.each(function(accountItem) {
                this.$tableBody.append(this.rowTemplate(accountItem.attributes));
            }, this);
        },
    });
})(this);

