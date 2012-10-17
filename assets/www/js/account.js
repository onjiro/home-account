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
            var totals = {}, i;
            for(i = 0; i < resultSet.rows.length; i++) {
                // TODO 現在地道に計算しているけど、全部データを突っ込んでから map かけた方が楽かも
                var newone = resultSet.rows.item(i)
                , item = newone.item
                , sum;
                if (totals[item]) {
                    if (newone.type === 'debit') {
                        sum = newone.amount - totals[item].amount;
                    } else {
                        sum = totals[item].amount - newone.amount;
                    }
                    totals[item] = new Account({
                        item: newone.item,
                        type: (sum < 0) ? 'credit': 'debit',
                        amount: (sum < 0) ? sum * -1: sum,
                    });
                } else {
                    totals[item] = new Account(resultSet.rows.item(i));
                }
            }
            if (onSuccess) { onSuccess(tx, totals); };
        }, onError);
    }
    return Constructor;
})(this);
