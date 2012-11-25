this.TransactionHistoryView = (function(global) {
    var TransactionHistoryView = Backbone.View.extend({
        initialize: function() {
            this.collection.on('add', this.add, this);
        },
        add: function(model, collections, options) {
            $added = (options.index === 0) ?
                this.$el.prepend(formatToTableRow(model)).children(':first-child'):
                this.$el.append(formatToTableRow(model)).children(':last-child');
            if (options.newest) {
                $added.hide().fadeIn();
            }
        }
    })
    , formatToTableRow = function(transaction) {
        var data = {
            cid        : transaction.cid,
            date       : _.template('<%= getMonth() %>/<%= getDate() %>', transaction.get('date')),
            items      : [],
            amount     : 0,
            creditItems: [],
        };
        _.each(transaction.get('accounts'), function(account) {
            switch (account.type) {
            case 'debit':
                data.items.push(account.item);
                data.amount += account.amount;
                break;
            case 'credit':
                data.creditItems.push(account.item);
                break;
            }
        });
        return _.template(ROW_TEMPLATE, data);
    }
    , ROW_TEMPLATE = ''
        + '<tr data-model-cid="<%= cid %>">'
        +   '<td><span class="label label-info"><%= date %></span></td>'
        +   '<td><%= items.join(", ") %></td>'
        +   '<td><span class="label"><%= creditItems %></span></td>'
        +   '<td style="text-align: right;"><%= amount %></td>'
        + '</tr>';

    return TransactionHistoryView;
})(this);
