#!/usr/bin/ruby
#coding: utf-8

require 'fileutils'
import 'rake/rakefile-js.rb'

##########
# CONFIG #
##########

Paths = {
	:src => 'src',
	:tools => 'tools',
	:build => 'build',
	:web => 'web',
	:web_inc_scripts => File.join('web', 'inc', 'scripts')
}

Tools = {
	:rhino => File.join(Paths[:tools], 'rhino.jar'),
	:closure_compiler => File.join(Paths[:tools], 'closure-compiler', 'compiler.jar'),
	:jslint => File.join(Paths[:tools], 'jslint-cli.js')
}

Commands = {
	:jslint => "java -cp #{Tools[:rhino]} org.mozilla.javascript.tools.shell.Main #{Tools[:jslint]}",
	:closure_compiler => "java -jar #{Tools[:closure_compiler]}"
}

Settings = {
	:encoding => Encoding::UTF_8
}

# Ensure that the build directory exists.
Dir.mkdir(Paths[:build]) if !Dir.exists?(Paths[:build])


#########
# TASKS #
#########

desc "Runs the compile task in each namespace."
task :default

desc "Runs the clean task in each namespace."
task :clean

task :deploy do
	FileList["#{Paths[:build]}/*.js"].each do |filename|
		FileUtils.cp(filename, Paths[:web_inc_scripts], :preserve => false)
	end
end

task :deploy => :default