require 'bundler/setup'
require 'capybara/rspec'
require 'capybara/spec/test_app'
require 'support/capybara.rb'
require 'support/test_app.rb'

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new app
end

module TestSessions
  Poltergeist = Capybara::Session.new(:poltergeist, TestApp)
end

Capybara.app = TestApp
