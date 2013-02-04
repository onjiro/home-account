require 'sinatra/base'

class TestApp
  set :root, File.dirname(__FILE__) + '/../../assets/www/'
  set :static, true
  set :public_folder, root
end
