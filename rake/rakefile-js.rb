#!/usr/bin/ruby
#coding: utf-8

require './rake/manifest'
require './rake/rake-util'

#########
# TASKS #
#########

js = namespace :js do
	desc "Compiles all modules by first concatenating all source files and saving a concatenated module source file to the '#{Paths[:build]}' directory then compiles the concatenated source file to the same directory with a '.min.js' suffix."
	task :compile

	# Iterate over all manifest files in the src directory. Manifest files are files with the '.manifest' extension.
	#
	# The following sections are supported by JavaScript manifest files:
	#
	# =options=
	# name = the new manifest name (also the module name) (without file extension)
	# build_dirname = the new build dirname (without trailing '/')
	# no_compilation (flag to disable compiling using the Closure Compiler)
	#
	# =files=
	# file-next-to-Rakefile.js
	# src/file-in-src.js
	# {manifest_path}/file-next-to-manifest.js
	# ...
	#
	# Where file names are relative to the directory containing the rake file.
	# The {manifest_path} is a special token that will be expanded to the path to the manifest file.
	#
	# =compiler options=
	# --compilation-level ADVANCED_OPTIMIZATIONS
	# --externs {manifest_path}/externs.js
	#
	# All compiler options are for the Closure Compiler. Compiler options must be specified one to a line.
	# The {manifest_path} is a special token that will be expanded to the path to the manifest file.
	ManifestFiles = FileList["#{Paths[:src]}/**/*.manifest"].include("#{Paths[:src]}/**/.manifest")
	SectionFactory = Manifest::Sections::Factory.new
	SectionFactory.register(:options, Manifest::Sections::Options)
	SectionFactory.register(:files, Manifest::Sections::Files)
	SectionFactory.register(:'compiler options', Manifest::Sections::ClosureCompilerOptions, :always_run => true)

	ManifestFiles.each do |filename|
		manifest = Manifest.new(filename, Paths[:build], SectionFactory,
			:module_extname => '.js',
			:compiled_module_extname => '.min.js',
			:encoding => Settings[:encoding]
		)

		# If the module is being compiled then we add it as a prerequisite to the compile task.
		if Rake::Task.task_defined?(manifest.compiled_module_filename)
			task :compile => manifest.compiled_module_filename
		# Otherwise we just add the concatenated module as a prerequisite to the compile task.
		else
			task :compile => manifest.module_filename
		end
	end

	desc "Run jslint on all JavaScript source files directly in the '#{Paths[:build]}' directory. If a filename is specified then just this file will be linted. Excludes files with the suffix 'extern[s].js' or '.min.js' or the prefix '_' when scanning the `#{Paths[:build]}` directory. Exit with status 1 if a file fails."
	task :lint, [:filename] do |t, args|
		if args.filename
			if File.exists?(args.filename)
				cmd = "#{Commands[:jslint]} #{args.filename}"
				results = %x{#{cmd}}

				unless results.length == 0
					puts "#{args.filename}:"
					puts results
					exit 1
				end
			end
		else
			FileList["#{args.directory}/*.js"].exclude(/externs?\.js$|\.min\.js$|\/_|^_/).each do |fname|
				cmd = "#{Commands[:jslint]} #{fname}"
				results = %x{#{cmd}}

				unless results.length == 0
					puts "#{fname}:"
					puts results
					exit 1
				end
			end
		end
	end

 	desc "Deletes all concatenated and compiled module files from '#{Paths[:build]}'. If a filename is specified then the filename suffixed with '.min.js' and '.js' will be removed from '#{Paths[:build]}'. If the filename argument already has a '.min.js' or a '.js' suffix then only the specified version will be deleted."
	task :clean, [:filename] do |t, args|
		if !args.filename.nil?
			if args.filename.end_with?('.min.js')
				filename = File.join(Paths[:build], args.filename)
				File.delete(filename) if File.exists?(filename)
			elsif args.filename.end_with?('.js')
				filename = File.join(Paths[:build], args.filename)
				File.delete(filename) if File.exists?(filename)
			else
				filename = File.join(Paths[:build], args.filename.chomp('.js').chomp('.min') + '.min.js')
				File.delete(filename) if File.exists?(filename)

				filename = File.join(Paths[:build], args.filename.chomp('.js').chomp('.min') + '.js')
				File.delete(filename) if File.exists?(filename)
			end
		else
			FileList["#{Paths[:build]}/*.js"].each do |filename|
				File.delete(filename) if File.exists?(filename)
			end
		end
	end
end

# Make our compile and clean tasks dependencies of the global
# default and clean tasks respectively.
task :default => js[:compile]
task :clean => js[:clean]