dbinitializer = require('./jstestlibs/database.helper').initializer()

casper.start('')
  .then ->
    dbinitializer.execute('home-account')
    @reload() # DBの更新が反映されないことへの回避策
  .waitFor dbinitializer.succeeded

casper.open('./assets/www/index.html')
  .then ->
    @test.comment '自動的にロードが終わること'
    @test.assertTitle 'Home Account'

  .waitWhileVisible '#history .loading', ->
    @test.assertExist '#history table'

casper
  .then ->
    @test.comment '新規の勘定科目を持つTransactionの追加が成功すること'

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
    @test.comment '設定ページを開けること'
    @clickLabel '設定', 'a'
  .then ->
    @test.assertTitle 'Home Account - configure'

casper
  .then ->
    @test.comment '登録済みの勘定科目が表示されていること'
    @test.assertEvalEquals (-> $('#account-item tbody tr').length), 3
    @test.assertSelectorHasText '#account-item tbody td', '食費'
    @test.assertSelectorHasText '#account-item tbody td', '外食'
    @test.assertSelectorHasText '#account-item tbody td', '現金'

casper
  .then ->
    @test.comment '勘定科目の分類が初期値である流動資産として表示されていること'
    @test.assertSelectorHasText '#account-item tbody tr:nth-child(1)', '流動資産'
    @test.assertSelectorHasText '#account-item tbody tr:nth-child(2)', '流動資産'
    @test.assertSelectorHasText '#account-item tbody tr:nth-child(3)', '流動資産'

casper
  .then ->
    @test.comment '勘定科目の分類をクリックするとセレクトボックスが出現すること'
    @test.assertVisible    '#account-item tbody tr td.classification span'
    @test.assertNotVisible '#account-item tbody tr td.classification select'
  .thenClick '#account-item tbody tr:first-child td.classification', ->
    @test.assertNotVisible '#account-item tbody tr:first-child td.classification span'
    @test.assertVisible    '#account-item tbody tr:first-child td.classification select'

casper
  .then ->
    @test.comment '初期値である流動資産が選択されていること'
    @test.assertEvalEquals (->$('#account-item tbody tr:first-child td.classification select option:selected').text()), '流動資産'

casper.run ->
  @test.done 16

