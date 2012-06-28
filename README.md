# Overview

Purejs is an API to help create constructors and manage their prototype chain. Purejs adheres to JavaScript's prototypal nature without introducing new ideas, allowing a greater integration with builtin constructors.


# Installation

Install locally:

	npm install git://github.com/dschnare/purejs.git

Or use as a dependency:

	{
		"dependencies": {
			"purejs": "git://github.com/dschnare/purejs.git"
		}
	}

If all you want is a minified version of this script and its dependencies so you can simply include it in your web page do the following:

1. Install Node with NPM.
2. Create an empty directory and run the following:

		npm install git://github.com/dschnare/purejs.git
		cd node_modules/purejs
		npm install
		npm run-script build-test

3. Copy the source files you want from `node_modules/purejs/test/js`. The combined script files contain purejs and all its dependencies.
4. Delete the directory you just created.


# Support

Supports all JavaScript 1.3 and above environments.

Supports being loaded as an AMD or Node/CommonJS module.

# Testing

If you want to run the tests then you will need to do the following:

	cd purejs
	npm install
	npm run-script build-test

Then open `test/index.html` in a web browser. This web page uses QUnit to run several unit tests.

**WARNING:** Do not run `npm install` with the `--dev` option on. This will result in an infinite dependency cycle. The cycle exists somewhere in the hierarchy, in some third-party module and I haven't been able to track it down to tell the author(s). Only run `npm install` with no arguments in the `purejs` module directory.


# API

If not loaded using a module framework then this module exports `PURE` in the global namespace.

See [purejs.org](http://www.purejs.org) for the API reference and more info.