this.AppView = (function(global) {
    return Backbone.View.extend({
        initialize: function() {
            this.collection.on('reset', function() {
                this.$('#history')
                    .children('.loading').hide().end()
                    .children('table').show();
            }, this);
        },
    });
})(this);
