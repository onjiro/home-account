dbinitializer = require('./jstestlibs/database.helper').initializer()
url = './assets/www/index.html'
now = null

casper.start('')
  .then ->
    dbinitializer.execute('home-account')
    @reload() # DBの更新が反映されないことへの回避策
  .waitFor dbinitializer.succeeded

casper.open(url)
  .then ->
    @test.comment '自動的にロードが終わること'
    @test.assertTitle 'Home Account'

  .waitWhileVisible '#history .loading', ->
    @test.assertExist '#history table'

casper
  .then ->
    @test.comment '集計されるTransactionの追加が成功すること'

    @fill 'form#account-entry',
      'amount'       : 120
      'item'         : '食費'
      'opposite-item': '現金'
    @click 'form#account-entry button[type="submit"]'
    now = new Date()

  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> $('#history tbody tr').length ), 1

casper
  .then ->
    @test.comment '"集計"をクリックするとタブが切り替わること'
    @test.assertNotVisible '#subtotal-tab'

    @click 'a[href="#subtotal-tab"]'

    @test.assertVisible '#subtotal-tab'
    @test.assertVisible '#subtotal-tab input[name="start"]'
    @test.assertVisible '#subtotal-tab input[name="end"]'

casper
  .then ->
    @test.comment '終了付のTransactionが集計結果に含まれること'

    @fill 'form#subtotal-query',
      'start': "#{now.getFullYear()}/#{now.getMonth() + 1}/#{now.getDate()}"
      'end'  : "#{now.getFullYear()}/#{now.getMonth() + 1}/#{now.getDate()}"

  .waitUntilVisible '.subtotals', ->
    @test.assertEvalEquals (->$('.subtotals tbody tr').length), 2

casper.run ->
  @test.done 8
