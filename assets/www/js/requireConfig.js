var require = {
    urlArgs: 'bust=' + (new Date()).getTime(),
    baseUrl: 'js/',
    deps: [
        'bootstrap',
        'jquery',
        'jquery-ui',
        'underscore',
        'backbone',
        'backbone-websql',
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
    },
}
