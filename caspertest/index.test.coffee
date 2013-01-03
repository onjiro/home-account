dbinitializer = require('./jstestlibs/database.helper').initializer()
casper = require('casper').create()
url = './assets/www/index.html'

casper.start('')
  .then ->
    dbinitializer.execute('home-account')
    @reload() # DBの更新が反映されないことへの回避策
  .waitFor dbinitializer.succeeded

casper.open(url)
  .then ->
    @test.assertTitle 'Home Account'

  .waitWhileVisible '#history .loading', ->
    @test.assertExist '#history table'

firstCreatedDate = null
casper
  .then ->
    @fill 'form#account-entry',
      'amount'       : 120
      'item'         : '食費'
      'opposite-item': '現金'
    @click 'form#account-entry button[type="submit"]'
    firstCreatedDate = new Date()

  .waitForSelector('.container .popup')
  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> document.querySelector('#history tbody').children.length), 1
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(1)', (firstCreatedDate.getMonth() + 1) + '/' + firstCreatedDate.getDate()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(2)', '食費'
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(3)', '120'

    @test.assertField 'amount'       , null
    @test.assertField 'item'         , null
    @test.assertField 'opposite-item', null

casper
  .then ->
    @fill 'form#account-entry',
      'amount'       : 980
      'item'         : '外食'
      'opposite-item': 'Edy'
    @click 'form#account-entry button[type="submit"]'

  .waitForSelector('.container .popup')
  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> document.querySelector('#history tbody').children.length), 2
    today = new Date()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(1)', (today.getMonth() + 1) + '/' + today.getDate()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(2)', '外食'
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(3)', '980'

casper
  .then ->
    @test.assertDoesntExist '.history-detail'

  .then ->
    @click '#history tbody tr:first-child'

  .then ->
    @test.assertExists '.history-detail'

casper.run ->
  @exit (if @test.getFailures().length then 1 else 0)
