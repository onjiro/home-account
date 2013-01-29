casper.start('')

casper.open('./assets/www/index.html')
  .then ->
    @test.assertTitle 'Home Account'

casper
  .then ->
    @test.comment '設定ページを開けること'
    @clickLabel '設定', 'a'
  .then ->
    @test.assertTitle 'Home Account - configure'

casper.run ->
  @test.done 2

