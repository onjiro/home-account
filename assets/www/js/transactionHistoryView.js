this.TransactionHistoryView = (function(global) {
    /**
     * @parameter $parent TransactionHistory の追加対象 jQuery エレメント
     */
    var $_parent
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
        var item = ''
        , amount = 0
        , creditItems = []
        , accounts = transaction.accounts;
        for (var i = 0; i < accounts.length; i++) {
            switch (accounts[i].type) {
            case 'debit':
                item += (item === '') ? '': ', ';
                item += accounts[i].item;
                amount += accounts[i].amount;
                break;
            case 'credit':
                creditItems.push(accounts[i].item);
                break;
            }
        }
        return [
            '<tr data-transaction-id="' + transaction.rowid + '">',
            '  <td>' + format(transaction.date) + '</td>',
            '  <td>' + item + '</td>',
            '  <td><span class="label">' + creditItems + '</span></td>',
            '  <td style="text-align: right;">' + amount + '</td>',
            '  <td>' + transaction.details + '</td>',
            '</tr>'
        ].join('\n');
    };

    /**
     * 表示する要素を追加します。
     * @parameter transaction 追加対象Transactionインスタンス
     */
    _this.prototype.prepend = function(transaction) {
        $_parent.prepend(formatToTableRow(transaction))
            .children(':first-child')
            .hide()
            .fadeIn();
    }

    /**
     * 表示する要素を$parentの最後に追加します。
     * @parameter transaction 追加対象Transactionインスタンス
     */
    _this.prototype.append = function(transaction) {
        $_parent.append(formatToTableRow(transaction))
            .children(':last-child');
    }
    return TransactionHistoryView;
})(this);
