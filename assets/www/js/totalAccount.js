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
        var _this = this, now = new Date();
        TotalAccount.select({item: _this.item, date: now}, tx, function(tx, accounts) {
            var current = accounts[0]
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
        var whereSection = [], queryParams = [];
        if (option && option.item) {
            whereSection.push('item = ?');
            queryParams.push(option.item);
        }
        if (option && option.date) {
            whereSection.push('date < ?');
            queryParams.push(new Date(option.date).getTime());
        }
        tx.executeSql([
            'SELECT',
            '  item,',
            '  SUM(CASE type WHEN \'debit\' THEN amount ELSE 0 END) AS debitAmount,',
            '  SUM(CASE type WHEN \'credit\' THEN amount ELSE 0 END) AS creditAmount',
            'FROM',
            '  Accounts',
            (whereSection.length > 0) ?
                'WHERE ' + whereSection.join(' and '):
                '',
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
            if (totals.length === 0 && option && option.item) {
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
