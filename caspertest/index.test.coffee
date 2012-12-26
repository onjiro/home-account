casper = require('casper').create()
url = './assets/www/index.html'

casper.start url, ->
  @test.assertTitle 'Home Account'

casper.run()
