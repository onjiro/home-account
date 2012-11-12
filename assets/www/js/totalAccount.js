this.TotalAccount = (function(global){
    var TotalAccount = function(values) {
        values = values || {};
        this.item = values.item;
        this.type = values.type || 'credit';
        this.amount = (values.amount) ? parseInt(values.amount): 0;
    }
    
    /**
     * 棚卸登録を行います。
     * @param tx DatabaseTransaction
     */
    TotalAccount.prototype.makeInventory = function(tx, success, err) {
        var _this = this;
        TotalAccount.select({item: this.item}, tx, function(tx, accounts) {
            var now = new Date()
            , current = accounts[0]
            , amount = (_this.type === current.type)
                ? _this.amount - current.amount
                : _this.amount + current.amount
            , type = (amount < 0)
                ? ((_this.type === 'credit') ? 'debit': 'credit')
                : _this.type;
            new Transaction({
                date: now,
                accounts: [
                    new Account({
                        date: now,
                        item: _this.item,
                        amount: Math.abs(amount),
                        type: type
                    }),
                    new Account({
                        date: now,
                        item: '棚卸差額',
                        amount: Math.abs(amount),
                        type: (type === 'credit') ? 'debit': 'credit'
                    })
                ]
            }).save(tx, function(tx, rowId, transaction) {
                if (success) {success(tx, _this, transaction)}
            }, err);
        }, err);
    }

    /**
     * 指定した科目の勘定の合計を取得します。
     * @param tx DatabaseTransaction
     * @param success 成功時のコールバック関数
     * @param err 失敗時のコールバック関数、オプション
     */
    TotalAccount.select = function(option, tx, success, err) {
        // TODO 本当は"現在の日付以前"を条件に追加したいが、それには date の保存形式の変更が必要
        var whereSection = "", queryParams = [];
        if (option && option.item) {
            whereSection += "WHERE item = ?";
            queryParams.push(option.item);
        }
        tx.executeSql([
            'SELECT',
            '  item,',
            '  SUM(CASE type WHEN \'debit\' THEN amount ELSE 0 END) AS debitAmount,',
            '  SUM(CASE type WHEN \'credit\' THEN amount ELSE 0 END) AS creditAmount',
            'FROM',
            '  Accounts',
            whereSection,
            'GROUP BY',
            '  item'
        ].join(' '), queryParams, function(tx, resultSet) {
            var totals = [], i;
            for(i = 0; i < resultSet.rows.length; i++) {
                var one = resultSet.rows.item(i);
                totals.push(new TotalAccount({
                    item: one.item,
                    type: (one.debitAmount < one.creditAmount) ? 'credit': 'debit',
                    amount: Math.abs(one.debitAmount - one.creditAmount)
                }));
            }
            if (totals.length === 0 && item) {
                totals.push(new TotalAccount({
                    item: item,
                    type: 'debit',
                    amount: 0
                }));
            }
            if (success) { success(tx, totals); };
        }, err);
    }
    return TotalAccount;
})(this);
