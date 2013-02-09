this.AccountItemClassificationList = (function(global){
    return Backbone.Collection.extend({
        sqls: {
            read: ''
                + 'SELECT '
                +   'rowid AS id,'
                +   'name,'
                +   'side '
                + 'FROM AccountItemClassifications ',
        },
    });
})(this);
