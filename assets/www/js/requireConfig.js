var require = {
    urlArgs: 'bust=' + (new Date()).getTime(),
    baseUrl: 'js/',
    deps: [
        'util',
        'bootstrap',
        'jquery',
        'jquery-ui',
        'underscore',
        'backbone-websql',
        'backbone',
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
        'accountItem': {
            deps: ['backbone'],
        },
        'accountItemList': {
            deps: ['backbone', 'accountItem'],
        },
        'account': {
            deps: ['backbone'],
        },
        'transactionModel': {
            deps: ['backbone'],
        },
        'transactionList': {
            deps: ['backbone', 'account', 'transactionModel'],
        },
        'totalAccountModel': {
            deps: ['backbone', 'account', 'transactionModel'],
        },
        'collection.commonlyUseAccountItemList': {
            deps: ['backbone'],
        },
        'migrator': {
            deps: ['backbone'],
            exports: 'Migrator',
        },
        'initialize': {
            deps: ['backbone', 'migrator'],
        },
        'indexTabController': {
            deps: ['jquery', 'bootstrap'],
        },
        'view.entryTab': {
            deps: ['backbone', 'account', 'transactionModel'],
        },
        'view.commonlyUseAccount': {
            deps: ['backbone'],
        },
        'view.commonlyUseAccountArea': {
            deps: ['backbone'],
        },
        'transactionDetailView': {
            deps: ['backbone'],
        },
        'totalAccountTableView': {
            deps: ['backbone'],
        },
        'inventoryTabView': {
            deps: ['backbone', 'totalAccountModel', 'totalAccountTableView'],
        },
        'subTotalView': {
            deps: ['backbone'],
        },
        'appView': {
            deps: ['backbone'],
        },
    },
}
