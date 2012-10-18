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
        TotalAccounts.select(this.item, tx, function(current) {
            var now = new Date()
            , difference = {
                date: now,
                item: _this.item,
                amount: (_this.type === current.type)
                    ? _this.amount - current.amount
                    : _this.amount + current.amount,
                type: (difference.amount < 0)
                    ? (_this.type === 'credit') ? 'debit': 'credit'
                    : _this.type
            }
            new Transaction({
                date: now,
                accounts: [
                    new Account(difference),
                    new Account({
                        date: now,
                        item: '棚卸差額',
                        amount: difference.amount,
                        type: (difference.type === 'credit') ? 'debit': credit
                    })
                ]
            }).save(tx, success, err);
        }, err);
    }

    // TODO TotalAccounts::select
    return TotalAccounts;
})(this);
