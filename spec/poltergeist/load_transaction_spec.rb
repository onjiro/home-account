require 'spec_helper'
require 'capybara/rspec'
require 'sinatra/base'

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

  it 'should be loaded automatic' do
    visit '/index.html'
    page.should have_xpath('//title', :text => 'Home Account')
  end
end
