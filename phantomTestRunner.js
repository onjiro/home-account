var system = require('system')
, page = require('webpage').create()
, runner;
if (system.args.length < 2) { console.log('Usage: ' + system.args[0] + ' [TestScript...]'); phantom.exit(1); }

// fill gap with node.js
phantom.injectJs('./phantomjslib/bind.js');
phantom.injectJs('./phantomjslib/util.js');

// setup mocha
phantom.injectJs('./phantomjslib/mocha-1.7.4/mocha.js');
phantom.injectJs('./phantomjslib/console.js');
mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true,
    reporter: mocha.Spec,
});

// include test scripts
var scripts = system.args.slice(1);
scripts.forEach(function(testScript) {
    phantom.injectJs(testScript);
}, this);

indent = function() {};

// run all
runner = mocha.run();
runner.on('end', function() {
    phantom.exit();
});
