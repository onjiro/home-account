casper = require('casper').create()
url = './assets/www/index.html'

casper.start url, ->
  @test.assertTitle 'Home Account'
  @test.assertDoesntExist '#history tbody td'

casper.run()
