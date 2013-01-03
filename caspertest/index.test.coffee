dbinitializer = require('./jstestlibs/database.helper').initializer()
casper = require('casper').create()
url = './assets/www/index.html'

casper.start('')
  .then ->
    dbinitializer.execute('home-account')
  .waitFor dbinitializer.succeeded

casper.open(url)
  .then ->
    @test.assertTitle 'Home Account'

  .waitWhileVisible '#history .loading', ->
    @test.assertExist '#history table'

casper
  .then ->
    @fill 'form#account-entry',
      'amount'       : 120
      'item'         : '食費'
      'opposite-item': '現金'
    @click 'form#account-entry button[type="submit"]'

  .waitForSelector('.container .popup')

  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> document.querySelector('#history tbody').children.length), 1
    today = new Date()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(1)', (today.getMonth() + 1) + '/' + today.getDate()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(2)', '食費'
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(3)', '120'

    @test.assertField 'amount'       , null
    @test.assertField 'item'         , null
    @test.assertField 'opposite-item', null

casper.run ->
  @exit (if @test.getFailures().length then 1 else 0)
