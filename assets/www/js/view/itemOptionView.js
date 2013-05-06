define(['backbone'], function(Backbone) {
    return Backbone.View.extend({
        tagName: 'option',
        events: {
            'select': function(e) {
                this.model.trigger(this.eventName, this.model)
            },
        },
        initialize: function() {
            this.eventName = this.options.eventName;
            this.render();
        },
        render: function() {
            this.$el.append(this.model.get('name'));
            return this;
        },
    });
});
