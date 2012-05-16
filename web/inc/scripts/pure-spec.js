(function () {
	'use strict';
	module('Adherence Tests');

	test('wild card adheresTo test', function () {
		ok(PURE.adheresTo({age: 23}, {age: '*'}), 'Expect object to adhereTo {age: "*"}.');
		equal(PURE.adheresTo({age: undefined}, {age: '*'}), false, 'Dont expect object to adhereTo {age: "*"}.');
		ok(PURE.adheresTo({age: null}, {age: '*'}), 'Expect object to adhereTo {age: "*"}.');
		ok(PURE.adheresTo({age: {}}, {age: '*'}), 'Expect object to adhereTo {age: "*"}.');
		equal(PURE.adheresTo({}, {age: '*'}), false, 'Dont expect object to adhereTo {age: "*"}.');
	});

	test('adherence test', function () {
		ok(PURE.adheresTo({}, Object.prototype), 'Expect object to adhereTo Object.prototype.');
		ok(PURE.adheresTo({name: 'Darren', age: 29}, {name: 'string', age: 'number'}), 'Expect object to adhereTo {name: "string", age: "number"}.');
	});
	module('Consructor Tests');

	test('empty constructor test', function () {
		var Ctr = PURE.constructor.create(),
			ctr = Ctr,
			o = new Ctr(),
			j = ctr();

		strictEqual(typeof Ctr, 'function', 'Expect Ctr to be a function.');
		ok(o instanceof Ctr, 'Expect o to be an instance of Ctr.');
		ok(j instanceof Ctr, 'Expect j to be an instance of Ctr.');

		if (typeof Object.prototype.isPrototypeOf === 'function') {
			ok(Ctr.prototype.isPrototypeOf(o), 'Expect Ctr.prototype is a prototype of o.');
			ok(Ctr.prototype.isPrototypeOf(j), 'Expect Ctr.prototype is a prototype of j.');
		}
		if (typeof Object.getPrototypeOf === 'function') {
			strictEqual(Object.getPrototypeOf(o), Ctr.prototype, 'Expect prototype of o is equal to Ctr.prototype.');
			strictEqual(Object.getPrototypeOf(j), Ctr.prototype, 'Expect prototype of j is equal to Ctr.prototype.');
		}

		strictEqual(Ctr.getName(), 'UnnamedConstructor', 'Expect Ctr.getName() equal to "UnnamedConstructor".');
	});

	test('simple constructor test', function () {
		var Ctr = PURE.constructor.create('CTR'),
			ctr = Ctr,
			o = new Ctr(),
			j = ctr();

		strictEqual(typeof Ctr, 'function', 'Expect Ctr to be a function.');
		ok(o instanceof Ctr, 'Expect o to be an instance of Ctr.');
		ok(j instanceof Ctr, 'Expect j to be an instance of Ctr.');

		if (typeof Object.prototype.isPrototypeOf === 'function') {
			ok(Ctr.prototype.isPrototypeOf(o), 'Expect Ctr.prototype to be a prototype of o.');
			ok(Ctr.prototype.isPrototypeOf(j), 'Expect Ctr.prototype to be a prototype of j.');
		}
		if (typeof Object.getPrototypeOf === 'function') {
			strictEqual(Object.getPrototypeOf(o), Ctr.prototype, 'Expect prototype of o to be equal to Ctr.prototype.');
			strictEqual(Object.getPrototypeOf(j), Ctr.prototype, 'Expect prototype of j to be equal to Ctr.prototype.');
		}

		strictEqual(Ctr.getName(), 'CTR', 'Expect Ctr.getName() equal to "CTR".');
	});

	test('copy constructor test', function () {
		var Ctr = PURE.constructor.create({
				copy: function (other) {
					this.copyCalled = true;
					this.init();
				},
				init: function () {
					this.initCalled = true;
				},
				helloWorld: function () {
					return 'Hello World';
				}
			}, 'CTR'),
			a = new Ctr(),
			b = a.constructor(a);

		notStrictEqual(a, b, 'Don\'t expect a to be identical to b.');
		ok(a.initCalled, 'a.initCalled to be true.');
		notEqual(a.copyCalled, true, 'Don\'t expect a.copyCalled to be true.');
		ok(b.initCalled, 'Expect b.initCalled to be true.');
		ok(b.copyCalled, 'Expect b.copyCalled to be true.');

		ok(a instanceof Ctr, 'Expect a to be an instance of Ctr.');
		ok(b instanceof Ctr, 'Expect b to be an instance of Ctr.');

		if (typeof Object.prototype.isPrototypeOf === 'function') {
			ok(Ctr.prototype.isPrototypeOf(a), 'Expect Ctr.prototype to be a prototype of a.');
			ok(Ctr.prototype.isPrototypeOf(b), 'Expect Ctr.prototype to be a prototype of b.');
		}
		if (typeof Object.getPrototypeOf === 'function') {
			strictEqual(Object.getPrototypeOf(a), Ctr.prototype, 'Expect prototype of a to be equal to Ctr.prototype.');
			strictEqual(Object.getPrototypeOf(b), Ctr.prototype, 'Expect prototype of b to be equal to Ctr.prototype.');
		}

		strictEqual(Ctr.getName(), 'CTR', 'Expect Ctr.getName() to equal to "CTR".');
	});

	test('members test', function () {
		var initCalled = false,
			Ctr = PURE.constructor.create({
				init: function () {
					initCalled = true;
				},
				helloWorld: function () {
					return 'Hello World';
				}
			}, 'CTR'),
			ctr = Ctr,
			o = new Ctr(),
			j = ctr();

		strictEqual(typeof Ctr, 'function', 'Expect Ctr to be a function.');
		ok(o instanceof Ctr, 'Expect o to be an instance of Ctr.');
		ok(j instanceof Ctr, 'Expect j to be an instance of Ctr.');

		if (typeof Object.prototype.isPrototypeOf === 'function') {
			ok(Ctr.prototype.isPrototypeOf(o), 'Expect Ctr.prototype is a prototype of o.');
			ok(Ctr.prototype.isPrototypeOf(j), 'Expect Ctr.prototype is a prototype of j.');
		}
		if (typeof Object.getPrototypeOf === 'function') {
			strictEqual(Object.getPrototypeOf(o), Ctr.prototype, 'Expect prototype of o to be equal to Ctr.prototype.');
			strictEqual(Object.getPrototypeOf(j), Ctr.prototype, 'Expect prototype of j to be equal to Ctr.prototype.');
		}

		strictEqual(Ctr.getName(), 'CTR', 'Expect Ctr.getName() to be equal to "CTR".');
		ok(initCalled, 'Expect initCalled to be true.');
		strictEqual(o.helloWorld(), 'Hello World', 'Expect o.helloWorld() to be equal to "Hello World".');
		ok(PURE.adheresTo(o, Ctr.prototype), 'Expect o to adhere to Ctr.prototype.');
	});

	test('base members test', function () {
		var personInitCalled = false,
			ninjaInitCalled = false,
			Person = PURE.constructor.create({
				init: function (name) {
					this.name = name;
					personInitCalled = true;
				},
				getName: function () {
					return this.name;
				},
				helloWorld: function () {
					return 'Hello World';
				}
			}, 'Person'),
			Ninja = PURE.constructor.create(Person, {
				init: function (name) {
					ninjaInitCalled = true;
					Person.prototype.init.call(this, name);
				},
				getName: function () {
					return Person.prototype.getName.call(this) + ' is a Ninja!';
				}
			}, 'Ninja'),
			nja = Ninja,
			ninja = nja('Darren');

		ok(ninja instanceof Ninja, 'Expect ninja to be an instance of Ninja.');
		ok(ninja instanceof Person, 'Expect ninja to be an instance of Person.');

		if (typeof Object.prototype.isPrototypeOf === 'function') {
			ok(Ninja.prototype.isPrototypeOf(ninja), 'Expect Ninja.prototype to be a prototype of ninja.');
			ok(Person.prototype.isPrototypeOf(ninja), 'Expect Person.prototype to be a prototype of ninja.');
		}
		if (typeof Object.getPrototypeOf === 'function') {
			strictEqual(Object.getPrototypeOf(ninja), Ninja.prototype, 'Expect prototype of ninja to equal Ninja.prototype.');
			notStrictEqual(Object.getPrototypeOf(ninja), Person.prototype, 'Don\'t expect prototype of ninja to equal Person.prototype.');
		}

		strictEqual(ninja.getName(), 'Darren is a Ninja!', 'Expect ninja.getName() t equal "Darren is a Ninja".');
		strictEqual(Ninja.getName(), 'Ninja', 'Expect Ninja.getName() tp equal "Ninja".');
		ok(personInitCalled, 'Expect personInitCalled to be true.');
		ok(ninjaInitCalled, 'Expect ninjaInitCalled to be true.');
		strictEqual(ninja.helloWorld(), 'Hello World', 'Expect ninja.helloWorld() to equal "Hello World".');
		strictEqual(ninja.helloWorld(), 'Hello World', 'Expect ninja.helloWorld() to equal "Hello World".');
		ok(PURE.adheresTo(ninja, Ninja.prototype), 'Expect ninja to adhere to Ninja.prototype.');
		ok(PURE.adheresTo(ninja, Person.prototype), 'Expect ninja to adhere to Person.prototype.');
	});
	module('Mixin Tests');

	function setup() {
		var create = function (o) {
				function F() {}
				F.prototype = o;
				return new F();
			},
			state = {
				a: {
					name: 'Ninja',
					age: 300
				}
			};

		state.b = create(state.a);
		state.b.stars = 800;
		state.b.health = 1000;

		return state;
	}

	test('ownProperty test', function () {
		var state = setup(), o = PURE.mixin({}, state.b);

		strictEqual(o.stars, state.b.stars, 'Expect o.stars to equal b.stars.');
		strictEqual(o.health, state.b.health, 'Expect o.health to equal b.health.');
		notStrictEqual(o.name, state.a.name, 'Don\'t Expect o.name to equal a.name.');
		notStrictEqual(o.age, state.a.age, 'Don\'t expect o.age to be equal to a.age.');
	});

	test ('overwrite property test', function () {
		var state = setup(), o;

		state.b.age = 3500;
		o = PURE.mixin(state.a, state.b);

		strictEqual(o.name, state.a.name, 'Expect o.name to equal a.name.');
		strictEqual(o.age, 3500, 'Expect o.age to equal 3500.');
	});

	test('object creation test', function () {
		var o = {},
			j;

		strictEqual(typeof o, 'object', 'Expect o to be an object.');

		j = PURE.mixin(o, {age: 45});
		strictEqual(o, j, 'Expect o to be the same object as j.');

		raises(function () {
			PURE.mixin();
		}, 'Expect PURE.mixin() to throw an error.');

		raises(function () {
			PURE.mixin(null, {age: 45});
		}, 'Expect PURE.mixin(null, {age: 45}) to throw an error.');
	});
	module('Type Testing Tests');

	var Str = String,
				Num = Number,
				Bool = Boolean,
				Arr = Array;

	test('isString test', function () {
		ok(PURE.isString('some string literal'), 'Expect string literal to be a string.');
		ok(PURE.isString(new String('some string literal')), 'Expect string object to be a string.');
		equal(PURE.isString(4), false, 'Don\'t expect number literal to be a string.');
		equal(PURE.isString(new Number(4)), false, 'Don\'t expect number object to be a string.');
		equal(PURE.isString([1, 2, 3]), false, 'Don\'t expect array literal to be a string.');
	});

	test('isBoolean test', function () {
		ok(PURE.isBoolean(true), 'Expect boolean literal to be a boolean.');
		ok(PURE.isBoolean(new Boolean(false)), 'Expect boolean object to be a boolean.');
		equal(PURE.isBoolean(4), false, 'Don\'t expect number literal to be a boolean.');
		equal(PURE.isBoolean(new Number(4)), false, 'Don\'t expect number object to be a boolean.');
		equal(PURE.isBoolean([1, 2, 3]), false, 'Don\'t expect array literal to be a boolean.');
		equal(PURE.isBoolean('true'), false, 'Don\'t expect string literal to be a boolean.');
	});

	test('isNumber test', function () {
		ok(PURE.isNumber(0), 'Expect number literal integer to be a number.');
		ok(PURE.isNumber(12.23), 'Expect number literal float to be a number.');
		ok(PURE.isNumber(12e4), 'Ex[ect number literal exponent to be a number.');
		ok(PURE.isNumber(new Number(12.34)), 'Expect number object to be a number.');
		equal(PURE.isNumber([1, 2, 3]), false, 'Don\'t expect array literal to be a number.');
		equal(PURE.isNumber('some string literal'), false, 'Don\'t expect string literal to be a number.');
		equal(PURE.isNumber(new String('some string literal')), false, 'Don\'t expect string object to be a number.');
	});

	test('isFunction test', function () {
		ok(PURE.isFunction(function () {}), 'Expect function literal to be a function.');
		equal(PURE.isFunction(10), false, 'Don\'t expect number literal to be a function.');
		equal(PURE.isFunction('function'), false, 'Don\'t expect string literal to be a function.');
		equal(PURE.isFunction(false), false, 'Don\'t expect boolean literal to be a function.');
		equal(PURE.isFunction({}), false, 'Don\'t expect object literal to be a function.');
	});

	test('isArray test', function () {
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

		ok(PURE.isArray([1, 2, 3]), 'Expect array literal to be an array.');
		ok(PURE.isArray(new Array(3)), 'Expect new Array() object to be an array.');
		ok(PURE.isArray(arrayLikeObject), 'Expect array-like object to be an array.');
		ok(PURE.isArray(extendedArrayObject), 'Expect extended array object to be an array.');
		equal(PURE.isArray(33.33), false, 'Don\'t expect number literal to be an array.');
		equal(PURE.isArray('some string literal'), false, 'Don\'t expect string literal to be an array.');
		equal(PURE.isArray(new String('some string literal')), false, 'Don\'t expect string object to be an array.');
	});

	test('isObject test', function () {
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

		ok(PURE.isObject({key: 'value'}), 'Expect object literal to be an object.');
		ok(PURE.isObject(new Number(4)), 'Expect number object to be an object.');
		ok(PURE.isObject(new String('4')), 'Expect string object to be an object.');
		ok(PURE.isObject(new Boolean(false)), 'Expect boolean object to be an object.');
		ok(PURE.isObject([1, 2, 3]), 'Expect array literal to be an object.');
		ok(PURE.isObject(new Array(3)), 'Expect new Array() object to be an object.');
		ok(PURE.isObject(extendedArrayObject), 'Expect extended array object to be an object.');
		ok(PURE.isObject(arrayLikeObject), 'Expect array-like object to be an object.');
		equal(PURE.isObject(1), false, 'Don\'t expect number literal to be an object.');
		equal(PURE.isObject('1'), false, 'Don\'t expect string literal to be an object.');
		equal(PURE.isObject(false), false, 'Don\'t expect boolean literal to be an object.');
	});

	test('isDefined test', function () {
		ok(PURE.isDefined('string'), 'Expect string literal to be defined.');
		ok(PURE.isDefined(45), 'Expect number literal to be defined.');
		ok(PURE.isDefined([2, 3, 4]), 'Expect array literal to be defined.');
		equal(PURE.isDefined(undefined), false, 'Don\'t expect undefined to be defined.');
		equal(PURE.isDefined(null), false, 'Don\'t expect null to be defined.');
	});

	test('isUndefined test', function () {
		ok(PURE.isUndefined(undefined), 'Expect undefined to be undefined.');
		ok(PURE.isUndefined(null), 'Expect null to be undefined.');
		equal(PURE.isUndefined('string'), false, 'Don\'t expect string literal to be undefined.');
		equal(PURE.isUndefined(45), false, 'Don\'t expect number literal to be undefined.');
		equal(PURE.isUndefined([2, 3, 4]), false, 'Don\'t expect array literal to be undefined.');
	});

	test('typeOf test', function () {
		strictEqual(PURE.typeOf(34), 'number', 'Expect number literal to be typeof "number".');
		strictEqual(PURE.typeOf('string'), 'string', 'Expect string literal to be typeof "string".');
		strictEqual(PURE.typeOf(true), 'boolean', 'Expect boolean literal to be typeof "boolean".');
		strictEqual(PURE.typeOf(function () {}), 'function', 'Expect function literal to be typeof "function".');
		strictEqual(PURE.typeOf(new Number(34)), 'object', 'Expect number object to be typeof "object".');
		strictEqual(PURE.typeOf(new String('string')), 'object', 'Expect string object to be typeof "object".');
		strictEqual(PURE.typeOf(new Boolean(true)), 'object', 'Expect boolean object to be typeof "object".');
		strictEqual(PURE.typeOf(null), 'null', 'Expect null to be typeof "null".');
		strictEqual(PURE.typeOf(undefined), 'undefined', 'Expect undefined to be typeof "undefined".');
		strictEqual(PURE.typeOf([1, 2, 3]), 'array', 'Expect array literal to be typeof "array".');
	});
}());