define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    return Backbone.View.extend({
        template: _.template($('#template-commonly-used-account').html()),
        className: 'commonly-used-account',
        tagName: 'span',
        events: {
            'click a': function(e) {
                e.preventDefault();
                this.trigger('selected', this.model.attributes);
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
});
