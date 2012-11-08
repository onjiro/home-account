var express = require('express')
, start = function(app, options) {
    var options = options || {}
    , port = options.port;
    app.use(express.static(__dirname + '/'));

    app.listen(port);
    console.log('server start at localhost:' + port);
};
start(express(), {
    port: process.env.PORT || 8000
});