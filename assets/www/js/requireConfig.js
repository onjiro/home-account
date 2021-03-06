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
    },
}
