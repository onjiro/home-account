define([
    'backbone'
], function(Backbone) {
    var Constructor = function(values) {
        values = values || {}
        this.transactionId = values.transactionId;
        this.item = values.item;
        this.itemId = values.itemId;
        this.amount = (values.amount) ? parseInt(values.amount): 0;
        this.date = new Date(values.date) || new Date();
        this.type = values.type || 'credit';
    },
    insertSql = ''
        + 'INSERT INTO Accounts ('
        +   'transactionId,'
        +   'date,'
        +   'itemId,'
        +   'amount,'
        +   'type'
        + ') VALUES (?, ?, ?, ?, ?)';

    Constructor.prototype.save = function(attribute, options) {
        var _this = this,
        options = options || {},
        doSave = function(newAccountItem) {
            options.tx.executeSql(insertSql, [
                _this.transactionId,
                _this.date.getTime(),
                _this.itemId || newAccountItem.attributes.id,
                _this.amount,
                _this.type
            ], function(tx, rs) {
                if (options.success) options.success(tx, rs.insertId)
            }, options.error);
        };
        // TODO ignore `attribute` now
        if (this.itemId) {
            doSave();
        } else {
            if (!confirm('新たに科目"' + this.item + '"を登録してよいですか？')) { return }
            options.accountItems.create({ name: this.item }, {
                tx:      options.tx,
                success: doSave,
                error:   options.error,
            });
        }
    }

    return Account = Constructor;
});
