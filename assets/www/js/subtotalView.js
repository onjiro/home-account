var SubTotalView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change input': function(e) {
                var start, end, _this = this;
                if (!(start = this.$el.find('input[name="start"]').val())) return;
                if (!(end   = this.$el.find('input[name="end"]').val()))   return;

                this.$el
                    .find('.loading').show()
                    .siblings().not('input');
                var $tbody = this.$el.find('tbody').empty();
                db.transaction(function(tx) {
                    TotalAccount.select({
                        startDate: new Date(start),
                        endDate:   new Date(end),
                    }, tx, function(tx, totals) {
                        _.each(totals, function(subTotal){
                            $tbody.append(_this.template(subTotal.attributes));
                        });
                        _this.$el
                            .find('.subtotals').show()
                            .siblings().not('input').hide();
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
