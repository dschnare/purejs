#!/usr/bin/ruby
#coding: utf-8

module Rake
	# Rpresents a module with several utilitarian Rake methods and tasks.
	module Util
		extend Rake::DSL

		# Creates a Rake file task that will concatenate the task's prerequisites.
		# This means that the file task must only have files as prerequisites.
		#
		# @param filename [String] The filename for the file task to create (i.e. destination file name).
		# @param opt [Hash] Options for customizing the concatenation.
		# @option opt [Encoding] :encoding The file encoding to use when reading files. Defaults to Encoding::UTF_8.
		# @param block [Proc] An optional block that will process the text of a file before concatenating. The proc is passed the filename and the text of the file.
		def Util.concat(filename, opt={}, &block)
			opt = opt || {}
			encoding = opt[:encoding] || Encoding::UTF_8

			file filename do |t|
				text = ''

				t.prerequisites.each do |file|
					txt = IO.read(file, encoding: encoding) if File.exists?(file)
					txt = block.call(file, txt) if block

					if text.empty?
						text = txt
					else
						text << "\n" << txt
					end
				end

				f = File.new(t.name, 'w')
				f.write(text)
				f.close
			end
		end
	end
end