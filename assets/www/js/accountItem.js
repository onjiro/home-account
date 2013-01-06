this.AccountItem = (function(global) {
    return Backbone.Model.extend({
        /**
         * @override Backbone.Model#defaults
         */
        defaults: {
            name: 'no-name',
            classificationId: 1,
        },
    });
})(this);
