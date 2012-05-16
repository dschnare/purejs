# Overview

Purejs is an API to help create constructors and manage their prototype chain. Purejs adheres to JavaScript's prototypal nature without introducing new ideas, allowing a greater integration with builtin constructors.


# Building

Ruby Rake is used to build the purejs module. Use `rake -D` to list all the rake tasks. For more indepth details on the build system for the project see my [project template](https://github.com/dschnare/project-template) repo, of which this project is based.

Use `rake deploy` to perform a build and to have all built files copied to 'web/inc/scripts'.


# Testing

There is a small web project in the 'web' directory for testing purposes. This project includes several unit test suites that test the validity of the purejs API.

# Support

Supports all JavaScript 1.3 and above environments.

# Build Products

This project contains several modules that get built into the 'build' directory.

**src/xport** - The xport module that exports a function used to export symbols for the Closure Compiler (< 1Kb when compiled).

- build/xport.js
- build/xport.min.js

**src/purejs** - The purejs module that exports the purejs API. Depends on the xport module.

- build/pure.js
- build/pure.min.js
- build/pure-complete.js (contains xport module)
- build/pure-complete.min.js (contains compiled xport module)

**src/pure-spec** - The purejs specification module that exports several unit test suites.

- build/pure-spec.js
- build/pure-spec.min.js

# Closure Compiler Externs Issues

The purejs `constructor.create` API relies on instances having an `init` or a `copy` method so you must ensure that these methods are either exported using the `xport` function or array access notation `[]`. As a convenience, purejs has an external declaration you may use in your modules to help remedy this: `instance.externs.js`. This extern file contains a constructor that declares `init` and `copy` to be part of its prototype, which will preserve each of these method names anywhere in your code.

Your manifest:

	=files=
	{manifest_path}/some-file.js
	{manifest_path}/some-file2.js

	=compiler options=
	--compilation_level ADVANCED_OPTIMIZATIONS
	--externs src/purejs/instance.externs.js

# API

See [purejs.org](http://www.purejs.org) for the API reference and more info.