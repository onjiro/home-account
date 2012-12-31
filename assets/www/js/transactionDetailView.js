this.TransactionDetailView = (function(global){
    return Backbone.View.extend({
        tagName: 'div',
        className: 'history-detail',
        events: {
            'click': function(e) {
                if (e.toElement.className === 'history-detail') this.remove();
            },
            'click .remove': function(e) {
                if (!window.confirm('履歴を削除します。')) return;
                this.model.destroy();
                this.remove();
            },
        },
        initialize: function() {
            var _this = this
            , template = _.template($('#history-detail').html());
            $('body').append(this.$el.append(template(this.model.attributes)));
            $(document).scroll(function(e) {
                _this.$el.css({top: $('body').scrollTop()});
            });
        },
    });
})();
