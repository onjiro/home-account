this.TotalAccounts = (function(global){
    var TotalAccounts = function(values) {
        values = values || {};
        this.item = values.item;
        this.type = values.type || 'credit';
        this.amount = (values.amount) ? parseInt(values.amount): 0;
    }
    
    /**
     * 棚卸登録を行います。
     * @param tx DatabaseTransaction
     */
    TotalAccounts.prototype.makeInventory = function(tx, success, err) {
        var _this = this;
        TotalAccounts.select(this.item, tx, function(tx, current) {
            var now = new Date()
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
     */
    TotalAccounts.select = function(item, tx, success, err) {
        // TODO 本当は"現在の日付以前"を条件に追加したいが、それには date の保存形式の変更が必要
        tx.executeSql([
            'SELECT',
            '  item,',
            '  type,',
            '  sum(amount) as amount',
            'FROM',
            '  Accounts',
            'WHERE',
            '  item = ?',
            'GROUP BY',
            '  item,',
            '  type'
        ].join(' '), [
            item
        ], function(tx, resultSet) {
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
                return new TotalAccounts({
                    item: credit.item || debit.item,
                    type: (amount < 0) ? 'credit': 'debit',
                    amount: Math.abs(amount),
                });
            });
            if (success) { success(tx, totals[0]); };
        }, err);
    }
    return TotalAccounts;
})(this);
