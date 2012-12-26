this.TransactionList = (function(global) {
    return Backbone.Collection.extend({
        model: Transaction,
        
        initialize: function(option) {
            this.db = (option || {}).db;
        },
        sync: function(method, collections, option) {
            var sync = this.sync
            , tx = (option || {}).tx;
            if (!tx) {
                this.db.transaction(function(tx) {
                    sync.call(this, method, collections, _.defaults(option, {tx: tx}));
                }, function(err) {
                    alert('something failed while accessing database.\n' + err.message);
                });
                return;
            }

            switch (method) {
            case 'read':
                Transaction.find(tx, function(tx, transactions) {
                    $.each(transactions.reverse(), function(i, transaction) {
                        collections.add(_.defaults(transaction, {db: db}));
                    });
                }, function(err) {
                    alert('something failed while accessing database.\n' + err.message);
                });
                break;
            default:
                throw new Error('not supported method called!!');
            }
        },
    })
})(this);
