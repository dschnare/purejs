# Overview

Pure.js is an API to help create constructors and manage their prototype chain. Pure.js adheres to JavaScript's prototypal nature without introducing new ideas, allowing a greater integration with builtin constructors.


# Installation

Install locally:

	npm install git://github.com/dschnare/purejs.git

Or use as a dependency:

	{
		"dependencies": {
			"purejs": "git://github.com/dschnare/purejs.git"
		}
	}


# Support

Supports all JavaScript 1.3 and above environments.

Supports being loaded as an AMD or Node/CommonJS module.

# Testing

If you want to run the tests then you will need to do the following:

	cd purejs
	npm install
	make test

# API

If not loaded using a module framework then this module exports `Pure` in the global namespace.

See [purejs.org](http://www.purejs.org) for the API reference and more info.

# Changelog

**4.0.0**

- Port source code to be CoffeeScript based
- Replace constructor.create with constructor-kit function; API is identical to constructor-kit
- Revamp the build process to use browserify and minify
- Support UMD module definition
- Deprecate the following features on constructors: copy constructors, init(), calling constructors without `new`, setting a name on a constructor
- Register as a bower component and NPM module

**3.0.0**

- Remove dependency on `xport` since it's deprecated.
- Clean up the dev dependencies, making it much easier to test.
- Create make files for minifying and testing.
- Change the exported name in browsers to `Pure` instead of `PURE`.
- isArray() no longer tests for Array-like objects. Objects are only considered an Array if they have Array in their prototype chain.
- isObject() now uses the following test: `o === Object(o)`.
- add isPrimitive() to test for `string`, `number` and `boolean` literals.
- add create() to create new objects from existing ones.
- constructor.create:
      - remove the getName() method on constructors created via Pure.constructor.create().
      - In a previous version the name argument was not being used, now it's being used by overriding the created constructor's toString() method.
      - The name argument no longer defaults to `UnnamedConstructor`.
      - If no name argument is given then the created constructor's toString() method is not overridden.
- Change the unit tests to use Jasmine.