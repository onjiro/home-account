this.TransactionHistoryView = (function(global) {
    // 依存モジュールを読み込む
    var Backbone = global.Backbone, Transaction = global.Transaction;
    if (typeof require !== 'undefined') {
        if (!Backbone) Backbone = require('backbone');
        if (!Transaction) Transaction = require('./transactionModel.js').Transaction;
    }

    /**
     * @parameter $parent TransactionHistory の追加対象 jQuery エレメント
     */
    var $_parent
    , transactions = new Backbone.Collection
    , BackbonedView = Backbone.View.extend({
    })
    , TransactionHistoryView = function($parent) {
        $_parent = $parent;
    }
    , _this = TransactionHistoryView
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

    /**
     * 表示する要素を$parentの最初に追加します。
     * @parameter transaction 追加対象Transactionインスタンス
     * @option オプションの指定. fade: フェードイン効果を追加
     */
    _this.prototype.prepend = function(transaction, option) {
        transactions.unshift(transaction);
        this._prepend(transaction, option);
    }

    _this.prototype._prepend = function(transaction, option) {
        $_parent.prepend(formatToTableRow(transaction))
        if (option && option.fade) {
            $_parent.children(':first-child')
                .hide()
                .fadeIn();
        }
    }

    /**
     * 表示する要素を$parentの最後に追加します。
     * @parameter transaction 追加対象Transactionインスタンス
     * @option オプションの指定. fade: フェードイン効果を追加
     */
    _this.prototype.append = function(transaction, option) {
        transactions.add(transaction);
        this._append(transaction, option);
    }

    _this.prototype._append = function(transaction, option) {
        $_parent.append(formatToTableRow(transaction))
        if (option && option.fade) {
            $_parent.children(':last-child')
                .hide()
                .fadeIn();
        }
    }
    return TransactionHistoryView;
})(this);
