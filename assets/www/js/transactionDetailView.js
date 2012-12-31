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
            var _this = this;
            this.$body = $('body');
            this.template = _.template($('#history-detail').html());

            this.render();
            $(document).scroll(function(e) { _this.followScroll(); });
        },
        render: function() {
            this.$el
                .detach()
                .empty()
                .append(this.template(this.model.attributes))
                .appendTo(this.$body);
            this.followScroll();
        },
        followScroll: function() {
            this.$el.css({top: this.$body.scrollTop()});
        },
    });
})();
