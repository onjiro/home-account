var EntryTabView = (function() {
    return Backbone.View.extend({
        events: {
            'click .edit-date': function(e){
                $('.past-mode').show()
                    .siblings().hide();
            },
        },
    });
})();
