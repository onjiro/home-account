this.TransactionDetailView = (function(global){
    return Backbone.View.extend({
        initialize: function() {
            var template = _.template($('#history-detail').html());
            $('body').append(this.$el.append(template(this.model.attributes)));
        },
    });
})();
