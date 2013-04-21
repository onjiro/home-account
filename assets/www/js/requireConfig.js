var require = {
    urlArgs: 'bust=' + (new Date()).getTime(),
    baseUrl: 'js/',
    deps: [
        'migration',
        'util',
        'bootstrap',
        'jquery',
        'jquery-ui',
        'underscore',
        'backbone',
        'backbone-websql',
    ],
    paths: {
        'bootstrap'      : 'lib/bootstrap.min',
        'backbone'       : 'lib/backbone-min',
        'backbone-websql': 'lib/backboneWebSql',
        'underscore'     : 'lib/underscore-min',
        'jquery'         : 'lib/jquery-2.0.0.min',
        'jquery-ui'      : 'lib/jquery-ui-1.10.0.custom',
        'migrator'       : 'lib/migrator',
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
        },
        'backbone-websql': {
            deps: ['backbone'],
        },
        'underscore': {
            exports: '_',
        },
        'jquery': {
            exports: '$'
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery']
        },

        // app modules
        'indexTabController': {
            deps: ['jquery', 'bootstrap'],
        },
        'view/entryTab': {
            deps: ['backbone', 'model/account', 'model/transaction'],
        },
        'view/commonlyUseAccount': {
            deps: ['backbone'],
        },
        'view/commonlyUseAccountArea': {
            deps: ['backbone'],
        },
        'view/transactionDetail': {
            deps: ['backbone'],
        },
        'view/totalAccountTable': {
            deps: ['backbone'],
        },
        'view/inventory': {
            deps: ['backbone', 'model/totalAccount', 'model/totalAccountList', 'model/totalAccountTableView'],
        },
        'view/subTotal': {
            deps: ['backbone'],
        },
        'view/app': {
            deps: ['backbone'],
        },
    },
}
