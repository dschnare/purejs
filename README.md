# Overview

This project is organized into the following partitions/abstractions.

- src

	This directory contains all source code that implements purejs.

- vendor

	This directory contains all the required third party binaries and source code.

	The following third party dependencies exist:

		- AjaxMin.exe (used to minify on Windows)
		- jsmin.c (used to minify on *NIX)
		- jslint.js (used to test the JavaScript source)
		- rhino.jar (used to execute jslint.js)

- web

	This directory is a web project used to test against the mustache specification.


# Get Started

All minified source files are located in `web/public/inc/scripts`. If you want to see the documented
source code then look at `src/pure.js`.


# Building

Ruby Rake is used to build the purejs module. Use `rake -D` to list all the rake tasks.
The `Rakefile` is commented quite well so you can read this file to understand how
the purejs module is built and minified.


# Testing

Any web server can be used to serve up the testing project, but for convenience a Sinatra web app
has been written to get testing quickly.

To get started with the built-in Sinatra app run (requires [Bundler](http://gembundler.com/) and [Foreman](https://github.com/ddollar/foreman)):

Mac/Linux/Unix:

	bundle install
	foreman start

Windows (does not require Foreman)

	bundle install
	bundle exec ruby -Cweb app.rb -p 5000

Once the web server is running then simply point your browser to [http://localhost:5000](http://localhost:5000).
To kill the web server press `Ctr+C`.


# Support

Supports all JavaScript 1.3 environments.


# API

See [purejs.org](http://www.purejs.org) for the API reference and more info.