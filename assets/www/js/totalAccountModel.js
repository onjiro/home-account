this.TotalAccount = (function(global){
    var TotalAccount = Backbone.Model.extend({
        // properties below
        initialize: function(values) {
            values = values || {};
            this.set({
                item  : values.item,
                itemClassification: values.itemClassification,
                type  : values.type || 'credit',
                amount: (values.amount) ? parseInt(values.amount): 0
            });
        },

        /**
         * 棚卸登録を行います。
         * @param tx DatabaseTransaction
         */
        makeInventory: function(tx, success, err) {
            var _this = this
            , now = new Date()
            , queryParameter = {
                item: _this.get('item'),
                date: now
            };
            TotalAccount.select(queryParameter, tx, function(tx, accounts) {
                var current = accounts[0]
                , amount = (_this.get('type') === current.get('type'))
                    ? _this.get('amount') - current.get('amount')
                    : _this.get('amount') + current.get('amount')
                , type = (amount < 0)
                    ? ((_this.get('type') === 'credit') ? 'debit': 'credit')
                : _this.get('type');
                new Transaction({
                    date: now,
                    accounts: [
                        new Account({
                            date: now,
                            item: _this.get('item'),
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
                }).save({}, {
                    tx: tx,
                    success: function(model, resultSet, options) {
                        if (success) success(tx, _this, model);
                    },
                });
            }, err);
        }
    }, {
        // class properties below
        /**
         * 指定した科目の勘定の合計を取得します。
         * @param tx DatabaseTransaction
         * @param success 成功時のコールバック関数
         * @param err 失敗時のコールバック関数、オプション
         */
        select: function(option, tx, success, err) {
            var whereSection = [], queryParams = [];
            if (option && option.item) {
                whereSection.push('AccountItems.name = ?');
                queryParams.push(option.item);
            }
            if (option && option.date) {
                whereSection.push('date < ?');
                queryParams.push(new Date(option.date).getTime());
            }
            if (option && option.startDate && option.endDate) {
                whereSection.push('date between ? and ?');
                queryParams = queryParams.concat([
                    new Date(option.startDate).getTime(),
                    new Date(option.endDate).getTime(),
                ].sort(function(a, b) { return a - b }));
            }
            tx.executeSql([
                'SELECT',
                '  AccountItems.name as item,',
                '  AccountItemClassifications.name as itemClassification,',
                '  SUM(CASE type WHEN \'debit\' THEN amount ELSE 0 END) AS debitAmount,',
                '  SUM(CASE type WHEN \'credit\' THEN amount ELSE 0 END) AS creditAmount',
                'FROM',
                '  Accounts',
                '  INNER JOIN AccountItems',
                '  ON Accounts.itemId = AccountItems.rowid',
                '  INNER JOIN AccountItemClassifications',
                '  ON AccountItems.classificationId = AccountItemClassifications.rowid',
                (whereSection.length > 0) ?
                    'WHERE ' + whereSection.join(' and '):
                    '',
                'GROUP BY',
                '  itemId'
            ].join(' '), queryParams, function(tx, resultSet) {
                var totals = [], i;
                for(i = 0; i < resultSet.rows.length; i++) {
                    var one = resultSet.rows.item(i);
                    totals.push(new TotalAccount({
                        item: one.item,
                        itemClassification: one.itemClassification,
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
    });

    return TotalAccount;
})(this);

var TotalAccountList = Backbone.Collection.extend({
    model: TotalAccount,
    sqls: {
        read: ''
            + '<% '
            +   'var to, where = [];'
            +    'if (to) {'
            +       'where.push(" date <= " + to.getTime());'
            +    '} '
            + '%>'
            + ''
            + 'SELECT '
            +   'AccountItems.name as item,'
            +   'AccountItemClassifications.name as itemClassification,'
            +   'CASE WHEN SUM(CASE type WHEN \'debit\' THEN amount ELSE 0 END) < SUM(CASE type WHEN \'credit\' THEN amount ELSE 0 END) THEN \'credit\' ELSE \'debit\' END AS type,'
            +   'ABS(SUM(CASE type WHEN \'debit\' THEN amount ELSE 0 END) - SUM(CASE type WHEN \'credit\' THEN amount ELSE 0 END)) AS amount '
            + 'FROM '
            +   'Accounts '
            +   'INNER JOIN AccountItems '
            +     'ON Accounts.itemId = AccountItems.rowid '
            +   'INNER JOIN AccountItemClassifications '
            +     'ON AccountItems.classificationId = AccountItemClassifications.rowid '
            + '<% if (where.length > 0) { %>'
            +   'WHERE '
            +     '<%= where.join(",") + " " %>'
            + '<% } %>'
            + 'GROUP BY '
            +   'itemId '
    },
    parse: function(response) {
        return _.map(response, function(one) {
            return new TotalAccount(one);
        });
        // if (totals.length === 0 && option && option.item) {
        //     totals.push(new TotalAccount({
        //         item: item,
        //         type: 'debit',
        //         amount: 0
        //     }));
        // }
    }
});
