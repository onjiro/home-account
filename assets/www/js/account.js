this.Account = function(values) {
    values = values || {}
    // properties
    this.item = values.item;
    this.amount = values.amount || 0;
    this.date = values.date || new Date();
    
    // functions
    this.save = function() {
    };
}
