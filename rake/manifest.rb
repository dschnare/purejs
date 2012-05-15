#!/usr/bin/ruby
#coding: utf-8

require './rake/rake-util'

# Represents a module manifest file. The manifest hold information describing
# the module like files to concatenate together to form the module and what
# compiler options to use when compiling.
#
# Manifests extend Hash so keys can be added at runtime. All keys can be accessed
# like attributes.
#
# When parsing the manifest file and a section is encountered, the registered section
# with the matching name will be instantiated then each line will be passed to the section instance
# for parsing. After the entire file has been completely parsed, any sections that were marked as
# 'always_run' but did not exist in the manifest file will be instantiated and ran.
#
# Section Syntax:
# =section name=
#
# Comments:
# '#' followd by text (single line comment)
#
# @example Manifest file example
#   =options=
#   message = hello world! # this is a comment
#
#   =another section=
#   something else
class Manifest < Hash
	# @!attribute name
	#   @return [String] The name of the manifest file as read from the filename. If the filename has no basename (i.e. .manifest)
	#     then the name will be set to the name of the parent directory.
	attr_accessor :name
	# @!attribute [r] dirname
	#   @return [String] The directory of the manifest file.
	attr_reader :dirname
	# @!attribute build_dirname
	#   @return [String] The directory to have the concatenated and compiled module files saved.
	attr_accessor :build_dirname
	# @!attribute [r] module_filename
	#   @return [String] The filename of the concatenated module file.
	def module_filename
		File.join(@build_dirname, @name + @module_extname)
	end
	# @!attribute [r] compiled_module_filename
	#   @return [String] The filename of the compiled module file.
	def compiled_module_filename
		File.join(@build_dirname, @name + @compiled_module_extname)
	end

	# Initialize the manifest file.
	#
	# @param filename [String] The filename of the manifest file to load.
	# @param build_dirname [String] The directory to place the concatenated and compiled module files.
	# @param section_factory [Sections::Factory] The factory to use when sections are encountered in the manifest file.
	# @param opt [Hash] Options to further customize the manifest declaration.
	# @option opt [Encoding] :encoding The encoding to use when reading files.
	# @option opt [String] :module_extname The file extension to use when saving the concatenated module file.
	# @option opt [String] :compiled_module_extname The file extension to use when saving the compiled module file.
	def initialize(filename, build_dirname, section_factory, opt={})
		opt = opt || {}

		@sections = {}
		@name = File.basename(filename, File.extname(filename))
		@build_dirname = build_dirname
		@dirname = File.dirname(filename)
		@build_dirname = build_dirname
		@section_factory = section_factory

		@name = @dirname.split(File::SEPARATOR).last if @name == File.basename(filename)

		@module_extname = opt[:module_extname] || '.js'
		@compiled_module_extname = opt[:compiled_module_extname] || '.min.js'
		encoding = opt[:encoding] || Encoding::UTF_8

		if File.exists?(filename)
			text = IO.read(filename, encoding: encoding)
			parse(text)
		else
			raise "Manifest file does not exist: #{filename}"
		end
	end

	private

	alias :get :'[]'
	alias :set :'[]='
	alias :has_method? :respond_to?

	public

	# Element Reference—Retrieves the value object corresponding to the key object. If not found, returns the default value (see Hash::new for details).
	#
	# Key will be converted to a Symbol by calling 'to_s' then 'to_sym'.
	def [](key)
		key = key.to_s

		if has_method?(key)
			method(key).call
		else
			key = key.to_sym
			super
		end
	end

	# Element Assignment—Associates the value given by value with the key given by key. Key should not have its value changed while it is in use as a key (a String passed as a key will be duplicated and frozen).
	#
	# Key will be converted to a Symbol by calling 'to_s' then 'to_sym'.
	def []=(key, value)
		key = key.to_s + '='

		if has_method?(key)
			method(key).call(value)
		else
			key = key.chomp('=').to_sym
			super
		end
	end

	private

	def method_missing(name, *args, &block)
		name = name.to_s

		if name.end_with?('=')
			name = name.chomp('=').to_sym
			set(name, value)
		else
			get(name.to_sym)
		end
	end

	def respond_to?(name)
		return true if self.has_key?(name.to_s.to_sym)
		super
	end

	def parse(text)
		section = nil

		text.lines.each do |line|
			line.gsub!(/#.*/, '')
			line.strip!

			if line.start_with?('=') && line.end_with?('=')
				line.gsub!(/^=\s*|\s*=$/, '')
				section.on_end if section
				section = @section_factory.create(line, self)
				@sections[line.to_sym] = section if section
			elsif !line.empty? && !section.nil?
				section.on_line(line)
			end
		end

		section.on_end if section
		section = nil

		run_missing_sections
		@sections.clear
	end

	private

	def run_missing_sections
		@section_factory.each_registration do |registration|
			if registration.always_run && !@sections.has_key?(registration.name)
				@section_factory.run(registration.name, self)
			end
		end
	end
end

class Manifest
	module Sections
		# @abstract Represents the base class for all manifest sections.
		class Section
			# Instantiates the section.
			#
			# @param manifest [Manifest] The manifest this section belongs to.
			def initialize(manifest)
				@manifest = manifest
			end

			# Life cycle method called when a line has been encountered in the manifest file of this section. May or may not be called.
			def on_line(line); end
			# Life cycle method called when this section has ended.
			def on_end; end
		end

		# Represnets a factory used to create sections by name.
		class Factory
			# Represents a registration object in a factory.
			Registration = Struct.new(:name, :klass, :always_run)

			# @!group Registration

			# @!attribute name
			#   @return [Symbol] The name of the section to appear in the manifest file.

			# @!attribute klass
			#   @return [Class] The section class registered.

			# @!attribute always_run
			#   @return [true, false] Determines if this section will be ran even if not present in the manifest file.

			# @!endgroup

			def initialize
				@sections = {}
			end

			# Registers a section class with this factory.
			#
			# @param name [Symbol, String] The name of the section that will appear in the manifest file.
			# @param klass [Class] The class (must extend from Section) that will be instantiated.
			# @param opt [Hash] Options to customize the section registration.
			# @option opt [true, false] :always_run Determines if this section will be ran even if not present in the manifest file. Default is false.
			def register(name, klass, opt={})
				opt = opt || {}
				opt[:always_run] = false if !opt.has_key?(:always_run)
				@sections[name.to_s.to_sym] = Registration.new(name.to_s.to_sym, klass, opt[:always_run])
			end

			# Attempts to create a section by name.
			#
			# @param name [Symbol, String] The name of the section to instantiate.
			# @param manifest [Manifest] The manifest the instantiated section belongs to.
			# @return [Section, nil] The instantiated section or nil.
			def create(name, manifest)
				name = name.to_s.to_sym;

				if @sections.has_key?(name)
					klass = @sections[name].klass
					klass.new(manifest)
				end
			end

			# Attempts to run a section by name. Instantiates and calls 'on_end' immediately.
			#
			# @param name [Symbol, String] The name of the section to instantiate.
			# @param manifest [Manifest] The manifest the instantiated section belongs to.
			def run(name, manifest)
				section = create(name, manifest)
				section.on_end if section
			end

			# Iterates over each registration object in this factory.
			#
			# @param block [Proc] The proc to call for each registration object.
			def each_registration(&block)
				@sections.each_value &block
			end
		end

		# Represents an options section in a manifest file. All options must be one to a line
		# and will be saved directoy on the manifest instance.
		#
		# @example Specifying options in a manifest
		#   =options=
		#   name = value
		#   name with spaces = value with spaces
		#   name=value
		#   name # this is a value-less option whose value will be set to the empty string
		#
		class Options < Section
			# (see Section#on_line)
			def on_line(line)
				pair = line.split('=')

				if pair.length == 2
					@manifest[pair[0].rstrip] = pair[1].lstrip
				else
					@manifest[pair[0].rstrip] = ''
				end
			end
		end

		# Represents a file section in a manfiest file. All files in this section represent
		# files that will be concatenated to form a module file. The concatenated module file
		# will be saved to Manfifest#module_filename.
		#
		# If any file has the token '!{manifest_path}' present it will be expanded to Manifest#dirname.
		#
		# @see Manifest#module_filename
		# @see Manifest#dirname
		class Files < Section
			include Rake::DSL

			# (see Section#on_line)
			def on_line(line)
				line.gsub!(/\{manifest_path\}/, @manifest.dirname)
				file @manifest.module_filename => line
			end

			# (see Section#on_end)
			def on_end
				Rake::Util.concat(@manifest.module_filename)
			end
		end

		# Represents a compiler options section for the Closure Compiler in a manifest file.
		# All options must be one to a line and must follow the same rules outlined by the Clousure Compiler.
		#
		# If any option has the token '!{manifest_path}' present it will be expanded to Manifest#dirname.
		#
		# @example Specifying Closure Compiler options
		#   =compiler options=
		#   --compilation_level WHITESPACE_ONLY
		#   --externs {manifest_path}/externs.js
		#
		# @see Manifest#dirname
		class ClosureCompilerOptions < Section
			include Rake::DSL

			# (see Section#initialize)
			def initialize(manifest)
				super(manifest)
				@options = []
			end

			# (see Section#on_line)
			def on_line(line)
				@options << line
			end

			# (see Section#on_end)
			def on_end
				if @manifest.no_compilation.nil? && Rake::Task.task_defined?(@manifest.module_filename)
					options = @options.empty? ? '--compilation_level ADVANCED_OPTIMIZATIONS' : @options.join(' ')
					options.gsub!(/\{manifest_path\}/, @manifest.dirname)

					file @manifest.compiled_module_filename => @manifest.module_filename do
						cmd = "#{Commands[:closure_compiler]} --js #{@manifest.module_filename} --js_output_file #{@manifest.compiled_module_filename} #{options}"
						results = %x{#{cmd}}
					end
				end
			end
		end
	end
end