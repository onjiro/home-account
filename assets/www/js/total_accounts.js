this.TotalAccounts = (function(global){
    var TotalAccounts = function(values) {
        values = values || {};
        this.item = values.item;
        this.type = values.type || 'credit';
        this.amount = (values.amount) ? parseInt(values.amount): 0;
    }
    return TotalAccounts;
})(this);
