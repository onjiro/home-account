this.TransactionList = (function(global) {
    return Backbone.Collection.extend({
        model: Transaction,
        
        initialize: function(option) {
            this.db = (option || {}).db;
        },
        sync: function(method, collections, option) {
            var sync = this.sync
            , tx = (option || {}).tx
            , _this = this;
            if (!tx) {
                this.db.transaction(function(tx) {
                    sync.call(_this, method, collections, _.defaults(option, {tx: tx}));
                }, function(err) {
                    alert('something failed while accessing database.\n' + err.message);
                });
                return;
            }

            switch (method) {
            case 'read':
                Transaction.find(tx, option, function(tx, transactions) {
                    _this.reset(_.map(transactions, function(one) {
                        return _.defaults(one, {db: db});
                    }) ,option);
                }, function(err) {
                    alert('something failed while accessing database.\n' + err.message);
                });
                break;
            default:
                throw new Error('not supported method called!!');
            }
            collections.trigger('request', collections, method, option);
        },
    })
})(this);
