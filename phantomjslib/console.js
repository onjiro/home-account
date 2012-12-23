console._log = console.log;
console.log = function() {console._log(format.apply(this, arguments))};
console._error = console.error;
console.error = function() {console._error(format.apply(this, arguments))};
process.stdout.write = function() {
    console.log.apply(this, arguments);
};
