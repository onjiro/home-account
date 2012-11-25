this.TransactionHistoryView = (function(global) {
    // 依存モジュールを読み込む
    var Backbone = global.Backbone, Transaction = global.Transaction;
    if (typeof require !== 'undefined') {
        if (!Backbone) Backbone = require('backbone');
        if (!Transaction) Transaction = require('./transactionModel.js').Transaction;
    }

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
    , format = function(date) {
        return (date.getMonth() + 1) + '/' + date.getDate();
    }
    , formatToTableRow = function(transaction) {
        var i
        , data = {
            cid        : transaction.cid,
            date       : format(transaction.get('date')),
            items      : [],
            amount     : 0,
            creditItems: [],
        }
        , accounts = transaction.get('accounts');
        for (var i = 0; i < accounts.length; i++) {
            switch (accounts[i].type) {
            case 'debit':
                data.items.push(accounts[i].item);
                data.amount += accounts[i].amount;
                break;
            case 'credit':
                data.creditItems.push(accounts[i].item);
                break;
            }
        }
        return _.template(
            '<tr data-model-cid="<%= cid %>">'
                +   '<td><span class="label label-info"><%= date %></span></td>'
                +   '<td><%= items.join(", ") %></td>'
                +   '<td><span class="label"><%= creditItems %></span></td>'
                +   '<td style="text-align: right;"><%= amount %></td>'
                + '</tr>'
            , data);
    };

    return TransactionHistoryView;
})(this);
