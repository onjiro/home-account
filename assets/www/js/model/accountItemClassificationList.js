define(['backbone'], function(Backbone) {
    return AccountItemClassificationList = Backbone.Collection.extend({
        sqls: {
            read: ''
                + 'SELECT '
                +   'rowid AS id,'
                +   'name,'
                +   'side '
                + 'FROM AccountItemClassifications ',
        },
    });
});
