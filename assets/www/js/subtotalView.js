var SubTotalView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change input': function(e) {
                if (!this.$el.find('input[name="start"]').val()) return;
                if (!this.$el.find('input[name="end"]').val())   return;
                // todo ダミーデータ使用の取りやめ
                this.$el
                    .find('tbody')
                    .append(this.template({
                        item: '食費',
                        type: 'debit',
                        amount: '980',
                    }))
                    .append(this.template({
                        item: '現金',
                        type: 'credit',
                        amount: '980',
                    }));
            },
        },
        initialize: function() {
            this.template = _.template($('#sub-total-template').html());
        },
    });
})(this);
