/*
 *  Copyright 2013 Darren Schnare
 *  Licensed under the MIT License, (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://opensource.org/licenses/MIT
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
(function (global) {
	'use strict';
	
	var Pure = {
		create: function (o) {
			// Convert the primitive to an object.
			if (Pure.isPrimitive(o)) o = new o.constructor(o);
			function F () {}
			F.prototype = o;
			return new F();
		},
		isString: function (o) {
			return typeof o === 'string' || o instanceof String;
		},
		isBoolean: function (o) {
			return typeof o === 'boolean' || o instanceof Boolean;
		},
		isNumber: function (o) {
			return typeof o === 'number' || o instanceof Number;
		},
		isFunction: function (o) {
			return typeof o === 'function';
		},
		isPrimitive: function (o) {
			var t = typeof o;
			return /string|number|boolean/.test(t);
		},
		isDefined: function (o) {
			return o !== null && o !== undefined;
		},
		isUndefined: function (o) {
			return o === undefined || o === null;
		},
		isArray: function (o) {
			return o instanceof Array || Object.prototype.toString.call(o) === '[object Array]';
		},
		isObject: function (o) {
			return o === Object(o);
		},
		typeOf: function (o) {
			if (o === null) return 'null';
			if (Pure.isArray(o)) return 'array';
			return typeof o;
		},
		mixin: function (o) {
			var i, len, k, a

			if (!o) {
				throw new Error('Expected at least one object as an argument.');
			}

			for (i = 1, len = arguments.length; i < len; i += 1) {
				a = arguments[i];

				if (Pure.isDefined(a)) {
					for (k in a) {
						if (a.hasOwnProperty(k)) {
							o[k] = a[k];
						}
					}
				}
			}

			return o;
		},
		adheresTo: function (o, interfce) {
			var k, typeofo, typeofi;

			if ((Pure.isObject(o) || Pure.isFunction(o) || Pure.isArray(o)) &&
					(Pure.isObject(interfce) || Pure.isFunction(interfce) || Pure.isArray(interfce))) {
				for (k in interfce) {
					if (interfce.hasOwnProperty(k)) {
						// Property can be any type, but must exist.
						if (interfce[k] === '*') {
							if (o[k] === undefined) return false;
						} else {
							if (Pure.typeOf(o[k]) !== Pure.typeOf(interfce[k]) &&
									Pure.typeOf(o[k]) !== interfce[k]) {
								return false;
							}
						}
					}
				}

				return true;
			}

			typeofo = Pure.typeOf(o);
			typeofi = Pure.typeOf(interfce);

			return typeofo === typeofi;
		},
		constructor: {
			create: function (base, members, name) {
				var prototype, ctr, b, m, n;
				
				b = base;
				m = members;
				n = name;

				// create()
				if (arguments.length === 0) {
					m = {};
					b = {};				
				} else if (arguments.length === 1) {
					// create(name)
					if (Pure.isString(b)) {
						n = b;
						m = {};
						b = {};
					// create(members)
					} else {
						m = b;
						b = {};
					}
				// create(members, name)
				} else if (arguments.length === 2) {
					if (Pure.isString(m)) {
						n = m;
						m = b;
						b = {};
					}
				// create(base, members, name)
				} else if (arguments.length === 3) {
					n = Pure.isDefined(n) ? n.toString() : '';
				}

				// If base is a function then we assume it's a constructor
				// so we read its prototype property.
				//
				// NOTE: This is allowed due to many programmer's familiarity
				// with classical models and how classical inheritence is
				// facilitated. However, this is not the preferred approach.
				if (Pure.isFunction(b)) {
					b = b.prototype;
				}

				// Manage our prototype chain by extending the base prototype.
				prototype = Pure.create(b);

				ctr = function (cpy) {
					var o = Pure.create(ctr.prototype);

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
				
				// Only override the toString() if a name is given to this constructor.
				if (Pure.isString(n) && n) {
					ctr.toString = (function (toString) {
						return function () {
							var s = toString.call(this);
							if (s.indexOf('function') === 0) {
								return s.replace(/function(\s*)/, 'function$1' + n);
							}

							return 'function ' + n + ' () { [native code] }';
						};
					}(ctr.toString));
				}

				// Mixin all properties from members onto our prototype.
				Pure.mixin(prototype, m);

				// Setup references to our prototype and constructor.
				ctr.prototype = prototype;
				prototype.constructor = ctr;

				return ctr;
			}
		}
	};

	/// Export ///

	if (typeof define === 'function' && define.amd && typeof define.amd === 'object') {
		define(function () { return Pure; });
	} else if (typeof exports !== 'undefined' && exports !== null) {
		if (typeof module !== 'undefined' && module !== null && module.exports) {
			module.exports = Pure;
		}
		exports.Pure = Pure;
	} else {
		global.Pure = Pure;
	}
}(this));