require 'rubygems'
require 'bundler/setup'
require 'sinatra'

#Just redirect to the test page.
get '/' do
	redirect to('/index.html')
end