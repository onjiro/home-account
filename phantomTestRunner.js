var system = require('system')
, page = require('webpage').create()
, runner;
if (system.args.length < 2) { console.log('Usage: ' + system.args[0] + ' [TestScript...]'); phantom.exit(1); }

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}

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
