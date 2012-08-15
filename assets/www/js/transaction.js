this.Transaction = (function(global) {
    var Constractor = function(values) {
        values = values || {};
        this.accounts = values.accounts || [];
    };
    return Constractor;
})(this);
