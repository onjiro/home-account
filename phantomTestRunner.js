var system = require('system')
, page = require('webpage').create()
, runner;
if (system.args.length < 2) { console.log('Usage: ' + system.args[0] + ' [TestScript...]'); phantom.exit(1); }

phantom.injectJs('./phantomjslib/bind.js');

// setup mocha
phantom.injectJs('./node_modules/mocha/mocha.js');
phantom.injectJs('./phantomjslib/util.js');
console._log = console.log;
console.log = function() {console._log(format.apply(this, arguments))};
console._error = console.error;
console.error = function() {console._error(format.apply(this, arguments))};
process.stdout.write = function() {
    console.log.apply(this, arguments);
};
mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true,
    reporter: mocha.reporters.Spec,
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
