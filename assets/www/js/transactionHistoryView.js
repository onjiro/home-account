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
        },
        /**
         * 表示する要素を$parentの最初に追加します。
         * @parameter transaction 追加対象Transactionインスタンス
         * @option オプションの指定. fade: フェードイン効果を追加
         */
        prepend: function(transaction, option) {
            this.collection.unshift(transaction, option);
        },
        /**
         * 表示する要素を$parentの最後に追加します。
         * @parameter transaction 追加対象Transactionインスタンス
         * @option オプションの指定. fade: フェードイン効果を追加
         */
        append: function(transaction, option) {
            this.collection.add(transaction, option);
        }
    })
    , format = function(date) {
        return date.getFullYear()
            + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
            + '/' + ('0' + date.getDate()).slice(-2)
            + ' ' + ('0' + date.getHours()).slice(-2)
            + ':' + ('0' + date.getMinutes()).slice(-2);
    }
    , formatToTableRow = function(transaction) {
        var i
        , items = []
        , amount = 0
        , creditItems = []
        , accounts = transaction.get('accounts');
        for (var i = 0; i < accounts.length; i++) {
            switch (accounts[i].type) {
            case 'debit':
                items.push(accounts[i].item);
                amount += accounts[i].amount;
                break;
            case 'credit':
                creditItems.push(accounts[i].item);
                break;
            }
        }
        return [
            '<tr data-transaction-id="' + transaction.get('rowid') + '">',
            '  <td>' + format(transaction.get('date')) + '</td>',
            '  <td>' + items.join(', ') + '</td>',
            '  <td><span class="label">' + creditItems + '</span></td>',
            '  <td style="text-align: right;">' + amount + '</td>',
            '  <td>' + transaction.get('details') + '</td>',
            '</tr>'
        ].join('\n');
    };

    return TransactionHistoryView;
})(this);
