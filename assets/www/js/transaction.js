this.Transaction = (function(global) {
    var Constractor = function(values) {
        values = values || {};
        this.date     = values.date     || new Date();
        this.accounts = values.accounts || [];
        this.details  = values.details  || "";
    };
    return Constractor;
})(this);
