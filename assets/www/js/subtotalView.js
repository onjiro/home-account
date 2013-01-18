var SubTotalView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change input': function(e) {
                var start, end, _this = this;
                if (!(start = this.$el.find('input[name="start"]').val())) return;
                if (!(end   = this.$el.find('input[name="end"]').val()))   return;
                db.transaction(function(tx) {
                    alert(TotalAccount);
                    TotalAccount.select({
                        startDate: new Date(start),
                        endDate:   new Date(end),
                    }, tx, function(tx, totals) {
                        // todo ダミーデータ使用の取りやめ
                        _this.$el
                            .find('tbody')
                            .append(_this.template({
                                item: '食費',
                                type: 'debit',
                                amount: '980',
                            }))
                            .append(_this.template({
                                item: '現金',
                                type: 'credit',
                                amount: '980',
                            }));
                    });
                }, function(err) {
                    alert('something failed on query TotalAccounts.\n' + err.message);
                });
            },
        },
        initialize: function() {
            this.template = _.template($('#sub-total-template').html());
        },
    });
})(this);
