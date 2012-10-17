this.Account = (function(global) {
    var Constructor = function(values) {
        values = values || {}
        this.transactionId = values.transactionId;
        this.item = values.item;
        this.amount = (values.amount) ? parseInt(values.amount): 0;
        this.date = new Date(values.date) || new Date();
        this.type = values.type || 'credit';
    }

    Constructor.prototype.save = function(tx, onSuccess, onError) {
        tx.executeSql([
            'INSERT INTO Accounts (',
            '  transactionId,',
            '  date,',
            '  item,',
            '  amount,',
            '  type',
            ') VALUES (?, ?, ?, ?, ?)'
        ].join(' '), [
            this.transactionId,
            this.date,
            this.item,
            this.amount,
            this.type
        ], function(tx, resultSet) {
            if (onSuccess) { onSuccess(tx, resultSet.insertId); };
        }, onError)
    }

    Constructor.total = function(tx, onSuccess, onError) {
        // TODO 現在の日付を条件に追加するには date の保存形式の変更が必要
        tx.executeSql([
            'SELECT',
            '  item,',
            '  type,',
            '  sum(amount) as amount',
            'FROM',
            '  Accounts',
            'GROUP BY',
            '  item,',
            '  type'
        ].join(' '), [
            // no query data given
        ], function(tx, resultSet) {
            var totals = {}, totalArray = [], i;
            for(i = 0; i < resultSet.rows.length; i++) {
                var newone = resultSet.rows.item(i);
                totals[newone.item] = totals[newone.item] || {};
                totals[newone.item][newone.type] = newone;
            }
            // Hash を Array に移し替える
            for (i in totals) {
                totalArray.push(totals[i]);
            }
            // map で各科目を合算する
            totalArray = $.map(totalArray, function(pair, i) {
                var credit = pair['credit'] || { amount: 0 }
                , debit = pair['debit'] || { amount: 0 }
                , amount = debit.amount - credit.amount;
                return new Account({
                    item: credit.item || debit.item,
                    type: (amount < 0) ? 'credit': 'debit',
                    amount: Math.abs(amount),
                });
            });
            if (onSuccess) { onSuccess(tx, totalArray); };
        }, onError);
    }
    return Constructor;
})(this);
