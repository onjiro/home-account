this.AccountItem = (function(global) {
    return Backbone.Model.extend({
        sqls: {
            create: ''
                + 'INSERT INTO AccountItems '
                +   '(name, classificationId) VALUES ('
                +     '"<%= name %>",'
                +     '(SELECT rowid FROM AccountItemClassifications '
                +       'WHERE name = "<%= classification %>")'
                +   ')',
            update: ''
                + 'UPDATE AccountItems SET classificationId = '
                + '(SELECT rowid FROM AccountItemClassifications '
                +   'WHERE name = "<%= classification %>") '
                + 'WHERE rowid = <%= id %>',
        },
        /**
         * @override Backbone.Model#defaults
         */
        defaults: {
            name: 'no-name',
            classification: '流動資産',
        },
    });
})(this);
