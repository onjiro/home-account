var SubTotalView = (function(global) {
    return Backbone.View.extend({
        collection: new Backbone.Collection(),
        events: {
            'change input': function(e) {
                var    start = this.$el.find('input[name="start"]').val()
                ,        end = this.$el.find('input[name="end"]').val()
                , collection = this.collection;
                if (!start || !end) return;

                this.showLoading();
                db.transaction(function(tx) {
                    TotalAccount.select({
                        startDate: new Date(start),
                        endDate:   new Date(end),
                    }, tx, function(tx, totals) {
                        collection.reset(totals);
                    });
                }, function(err) {
                    alert('something failed on query TotalAccounts.\n' + err.message);
                });
            },
        },
        initialize: function() {
            this.collection.on('reset', this.render, this);

            this.template = _.template($('#sub-total-template').html());
            this.$tbody = this.$el.find('tbody');
        },
        render: function() {
            if (this.collection.isEmpty()) {
                this.showEmptySubTotals();
                return;
            }

            this.$tbody.empty();
            _.each(this.collection.models, function(subTotal){
                this.$tbody.append(this.template(subTotal.attributes));
            }, this);
            this.showSubTotals();
        },
        showLoading: function() {
            this.$el.find('.loading').show().siblings().not('input').hide();
        },
        showEmptySubTotals: function() {
            this.$el.find('.empty-subtotals').show().siblings().not('input').hide();
        },
        showSubTotals: function() {
            this.$el.find('.subtotals').show().siblings().not('input').hide();
        },
    });
})(this);
