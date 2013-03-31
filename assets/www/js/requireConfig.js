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
        'bootstrap': 'bootstrap.min',
        'backbone': 'backbone-min',
        'backbone-websql': 'backboneWebSql',
        'underscore': 'underscore-min',
        'jquery': 'jquery-1.7.2.min',
        'jquery-ui': 'jquery-ui-1.10.0.custom',
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
            deps: ['backbone'],
        },
        'account': {
            deps: ['backbone'],
        },
        'transactionModel': {
            deps: ['backbone'],
        },
        'transactionList': {
            deps: ['backbone'],
        },
        'totalAccountModel': {
            deps: ['backbone'],
        },
        'collection.commonlyUseAccountItemList': {
            deps: ['backbone'],
        },
        'migrator': {
            deps: ['backbone'],
        },
        'initialize': {
            deps: ['backbone'],
        },
        'indexTabController': {
            deps: ['backbone'],
        },
        'view.entryTab': {
            deps: ['backbone'],
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
            deps: ['backbone'],
        },
        'subTotalView': {
            deps: ['backbone'],
        },
        'appView': {
            deps: ['backbone'],
        },
    },
}
