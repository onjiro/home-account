this.TransactionDetailView = (function(global){
    return Backbone.View.extend({
        events: {
            'click .history-detail': function(e) {
                if (e.toElement.className === 'history-detail') this.remove();
            },
            'click .remove': function(e) {
                if (!window.confirm('履歴を削除します。')) return;
                this.model.destroy();
                this.remove();
            },
        },
        initialize: function() {
            var template = _.template($('#history-detail').html());
            $('body').append(this.$el.append(template(this.model.attributes)));
        },
    });
})();
