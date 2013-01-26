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

casper
  .then ->
    @test.comment '新しいAccountItemを持つTransactionを追加できること'
    @fill 'form#account-entry',
      'amount'       : 120
      'item'         : '食費'
      'opposite-item': '現金'
    @click 'form#account-entry button[type="submit"]'
    firstCreatedDate = new Date()

  .waitForSelector('.container .popup')
  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> document.querySelector('#history tbody').children.length), 1

    @test.assertField 'amount'       , null
    @test.assertField 'item'         , null
    @test.assertField 'opposite-item', null

# todo 現在、新規科目追加時にセレクトボックスへ反映していないためreloadをかける=
casper
  .then ->
    @reload()
  .waitWhileVisible '#history .loading', ->
    @test.assertExist '#history table'
# ==============================================================================

firstCreatedDate = null
casper
  .then ->
    @test.comment 'AccountItemをセレクトボックスから選択してTransactionを追加できること'
    @fill 'form#account-entry',
      'amount'                    : 40
      'item-in-selection'         : '現金'
      'opposite-item-in-selection': '食費'
    @capture 'hoge.png'
    @click 'form#account-entry button[type="submit"]'
    firstCreatedDate = new Date()

  .waitForSelector('.container .popup')
  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> document.querySelector('#history tbody').children.length), 2
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(1)', (firstCreatedDate.getMonth() + 1) + '/' + firstCreatedDate.getDate()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(2)', '現金'
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(3)', '40'

    @test.assertField 'amount'       , null
    @test.assertField 'item'         , null
    @test.assertField 'opposite-item', null

casper.run ->
  @test.done 14

