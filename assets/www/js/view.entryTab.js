var EntryTabView = (function() {
    return Backbone.View.extend({
        events: {
            'click .edit-date': function(e){
                $('.past-mode').show()
                    .siblings().hide();
            },
            'click .no-edit-date': function(e) {
                $('.now-mode').show()
                    .siblings().hide();
                $('input').val(null);
            },
        },
    });
})();
