this.Transaction = (function(global) {
    return Backbone.Model.extend({
        // properties
        sqls: {
            create: 'INSERT INTO Transactions (date, details) VALUES (<%= date.getTime() %>, "<%= details %>")',
            delete: 'DELETE FROM Transactions WHERE rowid = <%= id %>',
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
            delete: 'DELETE FROM Accounts WHERE transactionId = <%= id %>',
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
    });
})(this);
