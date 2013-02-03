# -*- encoding: utf-8 -*-

require 'spec_helper'
require 'capybara/rspec'
require 'sinatra/base'

Capybara.default_driver = :poltergeist
Capybara.javascript_driver = :poltergeist
class TestApp
  set :root, File.dirname(__FILE__) + '/../../assets/www/'
  set :static, true
  set :public_folder, root
end
Capybara.app = TestApp

describe 'transaction history', :type => :feature do
  include Capybara::DSL

  before do
    @driver = TestSessions::Poltergeist.driver
    # todo Web SQLデータベースのセットアップ
  end

  after do
    @driver.reset!
  end

  it 'ページを開いた際に自動的にロードされること' do
    visit '/index.html'
    page.should have_xpath('//title', :text => 'Home Account')
    page.should have_selector('#history .loading', visible: false)
    page.should have_selector('#history table')
  end

  it 'Transactionを追加できること' do
    visit '/index.html'
    page.execute_script %Q{ $.fx.off = true } # setTimeoutが効いていないことへの回避策
    page.should have_selector('#history .loading', visible: false)
    page.should have_selector('#history table')

    within('form#account-entry') do
      fill_in 'amount'       , :with => '120'
      fill_in 'item'         , :with => '食費'
      fill_in 'opposite-item', :with => '現金'
    end
    find_button('決定').trigger('click')

    page.should have_selector('.container .popup')
    # todo setTimeoutが効いていないため `.popup` が削除されることへのチェックを省く
    page.should have_selector('#history tbody tr', :count => 1)
    within('form#account-entry') do
      find_field('amount').value.should        eq('')
      find_field('item').value.should          eq('')
      find_field('opposite-item').value.should eq('')
    end
  end
end
