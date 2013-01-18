var SubTotalView = (function(global) {
    return Backbone.View.extend({
        events: {
            'change input': function(e) {
                var start, end, _this = this;
                if (!(start = this.$el.find('input[name="start"]').val())) return;
                if (!(end   = this.$el.find('input[name="end"]').val()))   return;
                db.transaction(function(tx) {
                    TotalAccount.select({
                        startDate: new Date(start),
                        endDate:   new Date(end),
                    }, tx, function(tx, totals) {
                        var $tbody = _this.$el.find('tbody');
                        _.each(totals, function(subTotal){
                            $tbody.append(_this.template(subTotal.attributes));
                        });
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
