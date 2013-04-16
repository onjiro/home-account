this.Transaction = (function(global) {
    return Backbone.Model.extend({
        // properties
        sqls: {
            create: 'INSERT INTO Transactions (date, details) VALUES (?, ?)',
            'delete': 'DELETE FROM Transactions WHERE rowid = ?',
        },
        placeholders: {
            create: ['date.getTime', 'details'],
            'delete': ['id'],
        },
        hooks: {
            create: function(tx, resultSet) {
                _.each(this.get('accounts'), function(account) {
                    account.transactionId = this.id;
                    account.save({}, {
                        tx: tx,
                    });
                }, this);
            },
            'delete': 'DELETE FROM Accounts WHERE transactionId = <%= id %>',
        },

        initialize: function(values) {
            values = values || {};
            this.set({
                id       : values.id,
                date     : (values.date) ? new Date(values.date): new Date(),
                accounts : values.accounts || [],
                details  : values.details  || ""
            });
        },
        validate: function(attrs, options) {
            if (attrs.success) { return; }

            if (attrs.amount === '') {
                return '金額が指定されていません';
            } else if (_.find(attrs.accounts, function(account) { return account.item === ''; })) {
                return '品目または支払い方法で指定されていない箇所があります';
            }
        },
    });
})(this);
