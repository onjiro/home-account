this.TransactionDetailView = (function(global){
    return Backbone.View.extend({
        events: {
            'click .history-detail': function(e) {
                if (e.toElement.className === 'history-detail') this.remove();
            },
        },
        initialize: function() {
            var template = _.template($('#history-detail').html());
            $('body').append(this.$el.append(template(this.model.attributes)));
        },
    });
})();
