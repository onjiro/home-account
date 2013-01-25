dbinitializer = require('./jstestlibs/database.helper').initializer()
url = './assets/www/index.html'

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

  .waitWhileVisible '.container .popup', ->
    @fill 'form#account-entry',
      'amount'       : 980
      'item'         : '外食'
      'opposite-item': '現金'
    @click 'form#account-entry button[type="submit"]'

  .waitWhileVisible '.container .popup', ->
    @test.assertEvalEquals (-> $('#history tbody tr').length ), 2

casper
  .then ->
    @test.comment '"集計"をクリックするとタブが切り替わること'
    @test.assertNotVisible '#subtotal-tab'

    @click 'a[href="#subtotal-tab"]'

    @test.assertVisible '#subtotal-tab'
    @test.assertVisible '#subtotal-tab input[name="start"]'
    @test.assertVisible '#subtotal-tab input[name="end"]'
    @test.assertVisible '#subtotal-tab .term-not-assigned'

casper
  .then ->
    @test.comment '開始日と終了日が逆に入力されていても集計結果が表示されること'

    @fill 'form#subtotal-query',
      'start': '3000/12/31'
      'end'  : '2000/01/01'

  .waitUntilVisible '.subtotals', ->
    @test.assertEvalEquals (->$('.subtotals tbody tr').length), 3

casper.run ->
  @test.done 9
