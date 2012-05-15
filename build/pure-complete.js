/**
 * @preserve Module: xport
 * Author: Darren Schnare
 * Keywords: javascript,export
 * License: MIT ( http://www.opensource.org/licenses/mit-license.php )
 * Repo: https://github.com/dschnare/project-template
 */

/*globals 'window', 'define', 'exports', 'require' */

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
 *	// With dependencies
 *	xport.module(['dep1', 'jquery', 'dep2'], moduleFn, function () {
 *		xport('MODULE', moduleFn(DEP1, jQuery, DEP2));
 *	});
 *
 *	// Without dependencies
 *	xport.module(moduleFn, function () {
 *		xport('MODULE', moduleFn());
 *	});
 *
 *	// Without dependencies
 *	xport.module(someObject, function () {
 *		xport('MODULE', someObject);
 *	});
 *
 * @param {Array<String>=} deps The module dependencies to use when exporting via AMD or CommonJS (optional).
 * @param {function(...Object):Object|Object} fn The module function or if an object if there are no dependencies.
 * @param {function()} fallback The callback to call when no module system exists.
 */
xport('module', function (deps, fn, fallback) {
	'use strict';

	var d, i, o, k, Object = ({}).constructor;

	if (Object.prototype.toString.call(deps) !== '[object Array]') {
		fallback = fn;
		fn = deps;
		deps = [];

		// If 'fn' is not a function then wrap it in a function.
		if (typeof fn !== 'function') {
			fn = (function (o) {
				return function () {
					return o;
				};
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
/**
 * @preserve Author: Darren Schnare
 * Keywords: Keywords: javascript,constructor,inheritence,mixin,pure,type,testing
 * License: MIT ( http://www.opensource.org/licenses/mit-license.php )
 * Repo: https://github.com/dschnare/purejs
 */
/*global 'define', 'exports'*/
(function () {
	'use strict';

	var  Object = ({}).constructor,
		Array = ([]).constructor,
		String = ('').constructor,
		Boolean = (true).constructor,
		Number = (4).constructor,

		isString = function (o) {
			return typeof o === 'string' || o instanceof String;
		},
		isBoolean = function (o) {
			return typeof o === 'boolean' || o instanceof Boolean;
		},
		isNumber = function (o) {
			return typeof o === 'number' || o instanceof Number;
		},
		isFunction = function (o) {
			return typeof o === 'function';
		},
		isDefined = function (o) {
			return o !== null && o !== undefined;
		},
		isUndefined = function (o) {
			return o === undefined || o === null;
		},
		isArray = function (o) {
			return o instanceof Array || Object.prototype.toString.call(o) === '[object Array]' || (isDefined(o) && isNumber(o.length) && isFunction(o.push));
		},
		isObject = function (o) {
			return o && typeof o === 'object';
		},
		typeOf = function (o) {
			if (o === null) {
				return 'null';
			}
			if (isArray(o)) {
				return 'array';
			}
			return typeof o;
		},
		mixin = function (o) {
			var len = arguments.length,
				i,
				key,
				arg;

			if (!o) {
				throw new Error('Expected at least one object as an argument.');
			}

			for (i = 1; i < len; i += 1) {
				arg = arguments[i];

				if (isDefined(arg)) {
					for (key in arg) {
						if (arg.hasOwnProperty(key)) {
							o[key] = arg[key];
						}
					}
				}
			}

			return o;
		},
		pure = {};

	xport('isString', isString, pure);
	xport('isBoolean', isBoolean, pure);
	xport('isNumber', isNumber, pure);
	xport('isFunction', isFunction, pure);
	xport('isArray', isArray, pure);
	xport('isObject', isObject, pure);
	xport('isDefined', isDefined, pure);
	xport('isUndefined', isUndefined, pure);
	xport('typeOf', typeOf, pure);
	xport('mixin', mixin, pure);
	xport('adheresTo', function (o, interfce) {
		var key,
			typeofo,
			typeofi;

		if ((isObject(o) || isFunction(o) || isArray(o)) &&
				(isObject(interfce) || isFunction(interfce) || isArray(interfce))) {
			for (key in interfce) {
				if (interfce.hasOwnProperty(key)) {
					// Property can be any type, but must exist.
					if (interfce[key] === '*') {
						if (o[key] === undefined) {
							return false;
						}
					} else {
						if (typeOf(o[key]) !== typeOf(interfce[key]) &&
								typeOf(o[key]) !== interfce[key]) {
							return false;
						}
					}
				}
			}

			return true;
		}

		typeofo = typeOf(o);
		typeofi = typeOf(interfce);

		return typeofo === typeofi;
	}, pure);
	xport('constructor', {}, pure);
	xport('constructor.create', (function () {
		var create = (function () {
				var F = function () {};
				return function (o) {
					F.prototype = o;
					return new F();
				};
			}());

		return function (base, members, name) {
			var prototype,
				ctr,
				createInstance,
				b = base,
				m = members,
				n = name;

			if (arguments.length === 0) {
				m = {};
				b = {};
			} else if (arguments.length === 1) {
				if (typeof b === 'string') {
					n = b;
					m = {};
					b = {};
				} else {
					m = b;
					b = {};
				}
			} else if (arguments.length === 2) {
				if (isString(m)) {
					n = m;
					m = b;
					b = {};
				}
			} else if (arguments.length === 3) {
				n = isDefined(n) ? n.toString() : '';
			}

			// Set a default name if none was specified.
			n = isString(n) && n.length ? n : 'UnnamedConstructor';

			// If base is a function then we assume it's a constructor
			// so we read its prototype property.
			//
			// NOTE: This is allowed due to many programmer's familiarity
			// with classical models and how classical inheritence is
			// facilitated. However, this is not the preferred approach.
			if (isFunction(b)) {
				b = b.prototype;
			}

			// Manage our prototype chain by extending the base
			// prototype if we can, otherwise we mixin the properties from base.
			try {
				prototype = create(b);
			} catch (error) {
				if (isFunction(b.constructor) && isObject(b.constructor.prototype)) {
					prototype = create(b.constructor.prototype);
				} else {
					prototype = mixin({}, b);
				}
			}

			ctr = function (cpy) {
				// Create a new instance inheriting from our prototype.
				/** @type {Instance} */
				var o = create(ctr.prototype);

				// Trigger the copy contructor if we received a single
				// argument that is an instance of our constructor and
				// the copy() method exists. Then return the object.
				if (arguments.length === 1 &&
						cpy instanceof ctr &&
						typeof o.copy === 'function') {
					o.copy(cpy);

				// If we have an init() method then we call it with
				// the arguments we received from the constructor.
				} else if (typeof o.init === 'function') {
					if (arguments.length) {
						o.init.apply(o, arguments);
					} else {
						o.init();
					}
				}

				return o;
			};
			// Saveguard our constructor code from inspection and
			// use the constructor name.
			//ctr.toString = function () {
			//	return 'function ' + n + ' () { [native code] }';
			//};
			// Easy accessor to retrieve the constructor name.
			// (typically used for reflection purposes)
			ctr.getName = function () {
				return n;
			};

			// Mixin all properties from members onto our prototype.
			mixin(prototype, m);

			// Setup references to our prototype and constructor.
			ctr.prototype = prototype;
			prototype.constructor = ctr;

			return ctr;
		};
	}()), pure);

	xport.module(pure, function () {
		xport('PURE', pure);
	});
}());