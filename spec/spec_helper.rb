require 'bundler/setup'
require 'rspec'
require 'capybara/poltergeist'
require 'capybara/spec/test_app'

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new app
end

module TestSessions
  Poltergeist = Capybara::Session.new(:poltergeist, TestApp)
end

