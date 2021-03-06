dbinitializer = require('./jstestlibs/database.helper').initializer()
noop = (->)

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
    @test.comment '新しいTransactionが追加されること'

    @fill 'form#account-entry',
      'amount'       : 120
      'item'         : '食費'
      'opposite-item': '現金'
    @click 'form#account-entry button[type="submit"]'
    firstCreatedDate = new Date()

  .waitWhileVisible('.container .popup', noop)
  .wait 500, ->
    @test.assertEvalEquals (-> $('#history tbody tr').length ), 1
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(1)', (firstCreatedDate.getMonth() + 1) + '/' + firstCreatedDate.getDate()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(2)', '食費'
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(3)', '120'

    @test.assertField 'amount'       , null
    @test.assertField 'item'         , null
    @test.assertField 'opposite-item', null

casper
  .then ->
    @test.comment '新しいTransactionが先頭に追加されること'

    @fill 'form#account-entry',
      'amount'       : 980
      'item'         : '外食'
      'opposite-item': 'Edy'
    @click 'form#account-entry button[type="submit"]'

  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> $('#history tbody tr').length ), 2
    today = new Date()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(1)', (today.getMonth() + 1) + '/' + today.getDate()
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(2)', '外食'
    @test.assertSelectorHasText '#history tbody tr:first-child td:nth-child(3)', '980'

casper
  .then ->
    @test.comment '履歴からTransactionを選択したら詳細が表示されること'

    @test.assertDoesntExist '.history-detail'

    @click '#history tbody tr:first-child'

    @test.assertExists '.history-detail'
    @test.assertSelectorHasText '.history-detail .date', "#{firstCreatedDate.getFullYear()}/#{firstCreatedDate.getMonth() + 1}/#{firstCreatedDate.getDate()}"
    @test.assertSelectorHasText '.history-detail .date', "#{firstCreatedDate.getHours()}:#{firstCreatedDate.getMinutes()}"
    @test.assertSelectorHasText '.history-detail .debit' , '外食'
    @test.assertSelectorHasText '.history-detail .debit' , '980'
    @test.assertSelectorHasText '.history-detail .credit', 'Edy'
    @test.assertSelectorHasText '.history-detail .credit', '980'

casper
  .then ->
    @test.comment '詳細画面で削除ボタンをクリックしたらTransactionが削除されること'

    # window.confirm() に対して trueを返す
    @setFilter 'page.confirm', (msg) => true

    @click '.history-detail .remove'

  .waitWhileSelector '#history tbody tr:nth-child(2)', ->
    @test.assertDoesntExist '.history-detail'
    @test.assertEvalEquals (-> $('#history tbody tr').length ), 1
    @test.assertSelectorDoesntHaveText '#history tbody tr td:nth-child(2)', '外食'
    @test.assertSelectorDoesntHaveText '#history tbody tr td:nth-child(3)', '980'

casper.run ->
  @test.done 25
