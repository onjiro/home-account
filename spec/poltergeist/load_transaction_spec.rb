# -*- encoding: utf-8 -*-

require 'spec_helper'

describe 'transaction history', :type => :feature do
  include Capybara::DSL

  it 'ページを開いた際に自動的にロードされること' do
    visit '/index.html'
    page.should have_title('Home Account')
    page.should have_selector('#history .loading', visible: false)
    page.should have_selector('#history .body')
  end

  context '履歴がロード済みの場合' do
    before do
      visit '/index.html'
      page.should have_selector('#history .loading', visible: false)
      page.should have_selector('#history .body')
    end

    it 'Transactionを追加できること' do
      within('form#account-entry') do
        fill_in 'amount'       , :with => '120'
        fill_in 'item'         , :with => '食費'
        fill_in 'opposite-item', :with => '現金'
      end
      find_button('決定').trigger('click')
      entry_time = "#{Time.now.month}/#{Time.now.day}"

      page.should have_selector('.container .popup')
      # todo setTimeoutが効いていないため `.popup` が削除されることへのチェックを省く
      within('#history tbody') do
        page.should have_selector('tr', :count => 1)
        within('tr:first-child') do
          find('td:nth-child(1)').should have_content(entry_time)
          find('td:nth-child(2)').should have_content('食費')
          find('td:nth-child(3)').should have_content('120')
        end
      end
      within('form#account-entry') do
        find_field('amount').value.should        eq('')
        find_field('item').value.should          eq('')
        find_field('opposite-item').value.should eq('')
      end
    end

    it 'リロードした場合、それ以前に追加したTransactionが表示されること' do
      within('#history tbody') do
        page.should have_selector('tr', :count => 1)
        within('tr:first-child') do
          find('td:nth-child(2)').should have_content('食費')
          find('td:nth-child(3)').should have_content('120')
        end
      end
    end

    it '勘定科目をセレクトボックスから選択してTransactionを追加できること' do
      pending 'poltergeistでjQueryのselectイベントが発行されないため https://github.com/jonleighton/poltergeist/issues/204'

      within('form#account-entry') do
        fill_in 'amount', :with => '40'
        select '現金'   , :from => 'item-in-selection'
        select '食費'   , :from => 'opposite-item-in-selection'
      end
      find_button('決定').trigger('click')

      within('#history tbody') do
        page.should have_selector('tr', :count => 2)
        within('tr:first-child') do
          find('td:nth-child(1)').should have_content(entry_time)
          find('td:nth-child(2)').should have_content('食費')
          find('td:nth-child(3)').should have_content('120')
        end
      end
      within('form#account-entry') do
        find_field('amount').value.should        eq('')
        find_field('item').value.should          eq('')
        find_field('opposite-item').value.should eq('')
      end
    end
  end
end
