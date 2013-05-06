define([
    'backbone',
    'view/historyDetail',
], function(Backbone, DetailView) {
    return Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click': function(e) {
                new DetailView({ model: this.model });
            },
            "touchstart td": 'hover',
            "mouseover td" : 'hover',
            'touchend td'  : 'hout',
            'mouseout td'  : 'hout',
        },
        initialize: function() {
            this.model.on('destroy', function() {
                this.$el.fadeOut(_.bind(this.remove, this));
            }, this);
            this.render();
        },
        render: function() {
            this.$el.empty().append(this.template(this.model.attributes));
        },
        hover: function(e) {
            this.$el.addClass('hover');
            setTimeout(_.bind(function() { this.$el.removeClass('hover'); }, this), 1000);
        },
        hout: function(e) {
            this.$el.removeClass('hover');
        },
    });
});
