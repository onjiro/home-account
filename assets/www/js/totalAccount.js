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
        TotalAccount.select(this.item, tx, function(tx, accounts) {
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
    TotalAccount.select = function(item, tx, success, err) {
        // TODO 本当は"現在の日付以前"を条件に追加したいが、それには date の保存形式の変更が必要
        var whereSection = "", queryParams = [];
        if (item) {
            whereSection += "WHERE item = ?";
            queryParams.push(item);
        }
        tx.executeSql([
            'SELECT',
            '  item,',
            '  type,',
            '  sum(amount) as amount',
            'FROM',
            '  Accounts',
            whereSection,
            'GROUP BY',
            '  item,',
            '  type'
        ].join(' '), queryParams, function(tx, resultSet) {
            var totalPairs = {}, totals = [], i;
            for(i = 0; i < resultSet.rows.length; i++) {
                var newone = resultSet.rows.item(i);
                totalPairs[newone.item] = totalPairs[newone.item] || {};
                totalPairs[newone.item][newone.type] = newone;
            }
            // Hash を Array に移し替える
            for (item in totalPairs) {
                totals.push(totalPairs[item]);
            }
            // map で各科目を合算する
            totals = $.map(totals, function(pair, i) {
                var credit = pair['credit'] || { amount: 0 }
                , debit = pair['debit'] || { amount: 0 }
                , amount = debit.amount - credit.amount;
                return new TotalAccount({
                    item: credit.item || debit.item,
                    type: (amount < 0) ? 'credit': 'debit',
                    amount: Math.abs(amount),
                });
            });
            if (totals.length === 0) {
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
