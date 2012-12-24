var casper = require('casper').create()
, url = './assets/www/index.html';

casper.start(url, function() {
    this.test.assertTitle('Home Account');
});
casper.run();
