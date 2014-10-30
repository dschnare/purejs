var Pure = require('../pure');

describe('Pure', function () {
	describe('#adheresTo', function () {
		it('should handle wild card adherence tests', function () {
			expect(Pure.adheresTo({age: 23}, {age: '*'})).toBe(true);
			expect(Pure.adheresTo({age: undefined}, {age: '*'})).toBe(false);
			expect(Pure.adheresTo({age: null}, {age: '*'})).toBe(true);
			expect(Pure.adheresTo({age: {}}, {age: '*'})).toBe(true);
			expect(Pure.adheresTo({}, {age: '*'})).toBe(false);
		});

		it('should handle adherence tests with keys equalling property types', function () {
			expect(Pure.adheresTo({}, Object.prototype)).toBe(true);
			expect(Pure.adheresTo({name: 'Darren', age: 29}, {name: 'string', age: 'number'})).toBe(true);
		});
	});

	describe('#mixin', function () {
		function setup() {
			var state = {
					a: {
						name: 'Ninja',
						age: 300
					}
				};

			state.b = Pure.create(state.a);
			state.b.stars = 800;
			state.b.health = 1000;

			return state;
		}

		it('should only expect own properties to exist on target object', function () {
			var state = setup(), o = Pure.mixin({}, state.b);

			expect(o.stars).toBe(state.b.stars);
			expect(o.health).toBe(state.b.health);
			expect(o.name).not.toBe(state.a.name);
			expect(o.age).not.toBe(state.a.age);
		});

		it('should overwrite properties of the same name', function () {
			var state = setup(), o;

			state.b.age = 3500;
			o = Pure.mixin(state.a, state.b);

			expect(o.name).toBe(state.a.name);
			expect(o.age).toBe(3500);
		});

		it('should return the first object passed in', function () {
			var o, j;

			o = {};
			j = Pure.mixin(o, {age: 45});
			expect(o).toBe(j);
		});

		it('should throw an error if not given the correct arguments', function () {
			expect(function () {
				Pure.mixin();
			}).toThrow();

			expect(function () {
				Pure.mixin(null, {age: 45});
			}).toThrow();
		});
	});


	describe('#isString', function () {
		it('should test for a string literal or String object', function () {
			expect(Pure.isString('some string literal')).toBe(true);
			expect(Pure.isString(new String('some string literal'))).toBe(true);
			expect(Pure.isString(4)).toBe(false);
			expect(Pure.isString(new Number(4))).toBe(false);
			expect(Pure.isString([1, 2, 3])).toBe(false);
		});
	});

	describe('#isBoolean', function () {
		it('should test for a boolean literal or Boolean object', function () {
			expect(Pure.isBoolean(true)).toBe(true);
			expect(Pure.isBoolean(new Boolean(false))).toBe(true);
			expect(Pure.isBoolean(4)).toBe(false);
			expect(Pure.isBoolean(new Number(4))).toBe(false);
			expect(Pure.isBoolean([1, 2, 3])).toBe(false);
			expect(Pure.isBoolean('true')).toBe(false);
		});
	});

	describe('#isNumber', function () {
		it('should test for a number literal or Number object', function () {
			expect(Pure.isNumber(0)).toBe(true);
			expect(Pure.isNumber(12.23)).toBe(true);
			expect(Pure.isNumber(12e4)).toBe(true);
			expect(Pure.isNumber(new Number(12.34))).toBe(true);
			expect(Pure.isNumber([1, 2, 3])).toBe(false);
			expect(Pure.isNumber('some string literal')).toBe(false);
			expect(Pure.isNumber(new String('some string literal'))).toBe(false);
		});
	});

	describe('#isFunction', function () {
		it('should test for functions', function () {
			expect(Pure.isFunction(function () {})).toBe(true);
			expect(Pure.isFunction(10)).toBe(false);
			expect(Pure.isFunction('function')).toBe(false);
			expect(Pure.isFunction(false)).toBe(false);
			expect(Pure.isFunction({})).toBe(false);
		});
	});

	describe('#isArray', function () {
		it('should test for Array types', function () {
			// An array-like object (i.e. jQuery collection, etc.).
			var arrayLikeObject = {
					length: 0,
					push: function () {}
				},
				// Extend the Array.prototype via prototypal inheritence.
				A = function () {},
				extendedArrayObject;

			A.prototype = Array.prototype;
			extendedArrayObject = new A();

			expect(Pure.isArray([1, 2, 3])).toBe(true);
			expect(Pure.isArray(new Array(3))).toBe(true);
			expect(Pure.isArray(arrayLikeObject)).toBe(false);
			expect(Pure.isArray(extendedArrayObject)).toBe(true);
			expect(Pure.isArray(33.33)).toBe(false);
			expect(Pure.isArray('some string literal')).toBe(false);
			expect(Pure.isArray(new String('some string literal'))).toBe(false);
		});
	});

	describe('#isObject', function () {
		it('should test for objects', function () {
			// An array-like object (i.e. jQuery collection, etc.).
			var arrayLikeObject = {
					length: 0,
					push: function () {}
				},
				// Extend the Array.prototype via prototypal inheritence.
				A = function () {},
				extendedArrayObject;

			A.prototype = Array.prototype;
			extendedArrayObject = new A();

			expect(Pure.isObject({key: 'value'})).toBe(true);
			expect(Pure.isObject(new Number(4))).toBe(true);
			expect(Pure.isObject(new String('4'))).toBe(true);
			expect(Pure.isObject(new Boolean(false))).toBe(true);
			expect(Pure.isObject([1, 2, 3])).toBe(true);
			expect(Pure.isObject(new Array(3))).toBe(true);
			expect(Pure.isObject(extendedArrayObject)).toBe(true);
			expect(Pure.isObject(arrayLikeObject)).toBe(true);
			expect(Pure.isObject(1)).toBe(false);
			expect(Pure.isObject('1')).toBe(false);
			expect(Pure.isObject(false)).toBe(false);
		});
	});

	describe('#isDefined', function () {
		it('should test for non-null and non-undefined variables', function () {
			expect(Pure.isDefined('string')).toBe(true);
			expect(Pure.isDefined(45)).toBe(true);
			expect(Pure.isDefined([2, 3, 4])).toBe(true);
			expect(Pure.isDefined(undefined)).toBe(false);
			expect(Pure.isDefined(null)).toBe(false);
		});
	});

	describe('#isUndefined', function () {
		it('should test for null and undefined variables', function () {
			expect(Pure.isUndefined(undefined)).toBe(true);
			expect(Pure.isUndefined(null)).toBe(true);
			expect(Pure.isUndefined('string')).toBe(false);
			expect(Pure.isUndefined(45)).toBe(false);
			expect(Pure.isUndefined([2, 3, 4])).toBe(false);
		});
	});

	describe('#typeOf', function () {
		it('should retrieve the type of an object (including arrays and nulls)', function () {
			expect(Pure.typeOf(34)).toBe('number');
			expect(Pure.typeOf('string')).toBe('string');
			expect(Pure.typeOf(true)).toBe('boolean');
			expect(Pure.typeOf(function () {})).toBe('function');
			expect(Pure.typeOf(new Number(34))).toBe('object');
			expect(Pure.typeOf(new String('string'))).toBe('object');
			expect(Pure.typeOf(new Boolean(true))).toBe('object');
			expect(Pure.typeOf(null)).toBe('null');
			expect(Pure.typeOf(undefined)).toBe('undefined');
			expect(Pure.typeOf([1, 2, 3])).toBe('array');
		});
	});

	///////////////////////

	describe('constructor#create', function () {
		it('should mixin the passed in members object on the prototype', function () {
			var ctorCalled = false,
				Ctr = Pure.constructor.create(function () {
					ctorCalled = true;
				}, {
					helloWorld: function () {
						return 'Hello World';
					}
				}),
				ctr = Ctr,
				o = new Ctr();

			expect(typeof Ctr).toBe('function');
			expect(o instanceof Ctr).toBe(true);

			if (typeof Object.prototype.isPrototypeOf === 'function') {
				expect(Ctr.prototype.isPrototypeOf(o)).toBe(true);
			}

			if (typeof Object.getPrototypeOf === 'function') {
				expect(Object.getPrototypeOf(o)).toBe(Ctr.prototype);
			}

			expect(ctorCalled).toBe(true);
			expect(o.helloWorld()).toBe('Hello World');
			expect(Pure.adheresTo(o, Ctr.prototype)).toBe(true);
		});

		it('should mixin base members from the base prototype', function () {
			var personCtorCalled = false,
				ninjaCtorCalled = false,
				Person = Pure.constructor.create(function (name) {
					this.name = name;
					personCtorCalled = true;
				}, {
					getName: function () {
						return this.name;
					},
					helloWorld: function () {
						return 'Hello World';
					}
				}),
				Ninja = Pure.constructor.create(function (name) {
					ninjaCtorCalled = true;
					Person.call(this, name);
				}, {
					getName: function () {
						return Person.prototype.getName.call(this) + ' is a Ninja!';
					}
				}, Person),
				ninja = new Ninja('Darren');

			expect(ninja instanceof Ninja).toBe(true);
			expect(ninja instanceof Person).toBe(true);

			if (typeof Object.prototype.isPrototypeOf === 'function') {
				expect(Ninja.prototype.isPrototypeOf(ninja)).toBe(true);
				expect(Person.prototype.isPrototypeOf(ninja)).toBe(true);
			}

			if (typeof Object.getPrototypeOf === 'function') {
				expect(Object.getPrototypeOf(ninja)).toBe(Ninja.prototype);
				expect(Object.getPrototypeOf(ninja)).not.toBe(Person.prototype);
			}

			expect(ninja.getName()).toBe('Darren is a Ninja!');
			expect(personCtorCalled).toBe(true);
			expect(ninjaCtorCalled).toBe(true);
			expect(ninja.helloWorld()).toBe('Hello World');
			expect(ninja.helloWorld()).toBe('Hello World');
			expect(Pure.adheresTo(ninja, Ninja.prototype)).toBe(true);
			expect(Pure.adheresTo(ninja, Person.prototype)).toBe(true);
		});
	});
});