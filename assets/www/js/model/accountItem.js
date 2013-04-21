define(['backbone'], function(Backbone) {
    return AccountItem = Backbone.Model.extend({
        sqls: {
            create: ''
                + 'INSERT INTO AccountItems '
                +   '(name, classificationId) VALUES ('
                +     '?,'
                +     '(SELECT rowid FROM AccountItemClassifications '
                +       'WHERE name = ?)'
                +   ')',
            update: ''
                + 'UPDATE AccountItems SET classificationId = '
                + '(SELECT rowid FROM AccountItemClassifications '
                +   'WHERE name = ?) '
                + 'WHERE rowid = ?',
        },
        placeholders: {
            create: ['name', 'classification'],
            update: ['classification', 'id'],
        },
        /**
         * @override Backbone.Model#defaults
         */
        defaults: {
            name: 'no-name',
            classification: '流動資産',
        },
    });
});
