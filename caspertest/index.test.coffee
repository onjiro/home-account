casper = require('casper').create()
url = './assets/www/index.html'
dataLength = 0

casper.start url, ->
  @test.assertTitle 'Home Account'

casper.waitWhileVisible '#history .loading', ->
  @test.assertExist '#history table'
  dataLength = @evaluate ->
    document.querySelector('#history tbody').children.length

casper.then ->
  @fill 'form#account-entry',
    'amount'       : 120
    'item'         : '食費'
    'opposite-item': '現金'
  @click 'form#account-entry button[type="submit"]'

casper.waitForSelector '.container .popup'

casper.waitWhileVisible '.container .popup', ->
  currentDataLength = @evaluate ->
    document.querySelector('#history tbody').children.length
  @test.assertEquals currentDataLength, dataLength + 1
  today = new Date()
  @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(1)', today.getMonth() + '/' + today.getDate()
  @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(2)', '食費'
  @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(3)', '現金'
  @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(4)', '120'

casper.run()
