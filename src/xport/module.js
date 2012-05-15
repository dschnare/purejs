/**
 * @preserve Module: xport
 * Author: Darren Schnare
 * Keywords: javascript,export
 * License: MIT ( http://www.opensource.org/licenses/mit-license.php )
 * Repo: https://github.com/dschnare/project-template
 */

/*globals 'window' */

/**
 * Exports a symbol with the given name onto the specified scope.
 *
 * @param {String} name The name to give the symbol for export.
 * @param {Object} symbol The symbol to export.
 * @param {Object} scope The scope to export into. Defaults to the window object if it exists, otherwise an empty object.
 * @return {Object} The scope exported to.
 */
function xport(name, symbol, scope) {
	'use strict';

	name = name ? name.toString() : '';

	if (!scope) {
		if (typeof window !== 'object') {
			scope = {};
		} else {
			scope = window;
		}
	}

	var names = name.split('.'),
		len = names.length,
		o = scope,
		i,
		n;

	for (i = 0; i < len - 1; i += 1) {
		n = names[i];

		if (o[n] === undefined) {
			o[n] = {};
		}

		o = o[n];
	}

	n = names[len - 1];
	o[n] = symbol;

	return scope;
}

/**
 * Attempts to export a module using either the AMD or CommonJS module system. If no module system
 * is present then will call the fallback callback.
 *
 * For example:
 *   // With dependencies
 *   xport.module(['dep1', 'jquery', 'dep2'], moduleFn, function () {
 *     xport('MODULE', moduleFn(DEP1, jQuery, DEP2));
 * 	 });
 *
 *   // Without dependencies
 *   xport.module(moduleFn, function () {
 *     xport('MODULE', moduleFn());
 * 	 });
 *
 *   // Without dependencies
 *   xport.module(someObject, function () {
 *     xport('MODULE', someObject);
 * 	 });
 *
 * @param {Array<String>=} deps The module dependencies to use when exporting via AMD or CommonJS (optional).
 * @param {function(...Object):Object|Object} fn The module function or if an object if there are no dependencies.
 * @param {function()} fallback The callback to call when no module system exists.
 */
 xport('module', function (deps, fn, fallback) {
	var d, i, o, k;

	if (arguments.length == 2) {
		fallback = fn;
		fn = deps;
		deps = [];

		// If 'fn' is not a function then wrap it in a function.
		if (typeof fn !== 'function') {
			fn = (function (o) {
				return function () {
					return o;
				}
			}(fn));
		}
	}

	// Asynchronous modules (AMD) supported.
	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		if (deps.length === 0) {
			define(fn);
		} else {
			define(deps, fn);
		}
	// Nodejs/CommonJS modules supported.
	} else if (typeof exports === 'object' && exports && typeof require === 'function') {
		if (deps.length === 0) {
			o = fn();
		} else {
			d = [];
			i = deps.length;

			// Require all dependencies.
			while (i > 0) {
				i -= 1;
				d.unshift(require(deps[i]));
			}

			// Build the module.
			o = fn.apply(undefined, d);
		}

		// Export the module.
		if (o) {
			for (k in o) {
				if (o.hasOwnProperty(k)) {
					exports[k] = o[k];
				}
			}
		}
	// There is no module system present so call the fallback.
	} else if (typeof fallback === 'function') {
		fallback();
	}
}, xport);

// Export ourselves.
xport('xport', xport);