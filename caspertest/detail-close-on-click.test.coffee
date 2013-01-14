dbinitializer = require('./jstestlibs/database.helper').initializer()

casper.start('')
  .then ->
    dbinitializer.execute('home-account')
    @reload() # DBの更新が反映されないことへの回避策
  .waitFor dbinitializer.succeeded

casper.open('./assets/www/index.html')
  .then ->
    @test.assertTitle 'Home Account'

casper
  .then ->
    @test.comment '自動的にロードが終わること'
  .waitWhileVisible '#history .loading', ->
    @test.assertExist '#history table'

firstCreatedDate = null
casper
  .then ->
    @test.comment 'Transactionを追加できること'
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
    @test.comment '履歴からTransactionを選択したら詳細が表示されること'
    @test.assertDoesntExist '.history-detail'

  .thenClick '#history tbody tr:first-child', ->
    @test.assertExists '.history-detail'
    @test.assertSelectorHasText '.history-detail .date', "#{firstCreatedDate.getFullYear()}/#{firstCreatedDate.getMonth() + 1}/#{firstCreatedDate.getDate()}"
    @test.assertSelectorHasText '.history-detail .date', "#{firstCreatedDate.getHours()}:#{firstCreatedDate.getMinutes()}"
    @test.assertSelectorHasText '.history-detail .debit' , '食費'
    @test.assertSelectorHasText '.history-detail .debit' , '120'
    @test.assertSelectorHasText '.history-detail .credit', '現金'
    @test.assertSelectorHasText '.history-detail .credit', '120'

casper
  .then ->
    @test.comment '詳細画面で欄外を選択したら詳細が閉じられること'

  .thenClick '.history-detail', ->
    @test.assertDoesntExist '.history-detail'

casper.run ->
  @test.done 18
