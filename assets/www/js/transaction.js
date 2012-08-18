this.Transaction = (function(global) {
    var Constructor = function(values) {
        values = values || {};
        this.date     = values.date     || new Date();
        this.accounts = values.accounts || [];
        this.details  = values.details  || "";
    };
    return Constructor;
})(this);
