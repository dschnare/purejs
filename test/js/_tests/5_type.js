	module('Type Testing Tests');

	test('isString test', function () {
		ok(PURE.isString('some string literal'), 'Expect string literal to be a string.');
		ok(PURE.isString(new Str('some string literal')), 'Expect string object to be a string.');
		equal(PURE.isString(4), false, 'Don\'t expect number literal to be a string.');
		equal(PURE.isString(new Num(4)), false, 'Don\'t expect number object to be a string.');
		equal(PURE.isString([1, 2, 3]), false, 'Don\'t expect array literal to be a string.');
	});

	test('isBoolean test', function () {
		ok(PURE.isBoolean(true), 'Expect boolean literal to be a boolean.');
		ok(PURE.isBoolean(new Bool(false)), 'Expect boolean object to be a boolean.');
		equal(PURE.isBoolean(4), false, 'Don\'t expect number literal to be a boolean.');
		equal(PURE.isBoolean(new Num(4)), false, 'Don\'t expect number object to be a boolean.');
		equal(PURE.isBoolean([1, 2, 3]), false, 'Don\'t expect array literal to be a boolean.');
		equal(PURE.isBoolean('true'), false, 'Don\'t expect string literal to be a boolean.');
	});

	test('isNumber test', function () {
		ok(PURE.isNumber(0), 'Expect number literal integer to be a number.');
		ok(PURE.isNumber(12.23), 'Expect number literal float to be a number.');
		ok(PURE.isNumber(12e4), 'Ex[ect number literal exponent to be a number.');
		ok(PURE.isNumber(new Num(12.34)), 'Expect number object to be a number.');
		equal(PURE.isNumber([1, 2, 3]), false, 'Don\'t expect array literal to be a number.');
		equal(PURE.isNumber('some string literal'), false, 'Don\'t expect string literal to be a number.');
		equal(PURE.isNumber(new Str('some string literal')), false, 'Don\'t expect string object to be a number.');
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
		ok(PURE.isArray(new Arr(3)), 'Expect new Array() object to be an array.');
		ok(PURE.isArray(arrayLikeObject), 'Expect array-like object to be an array.');
		ok(PURE.isArray(extendedArrayObject), 'Expect extended array object to be an array.');
		equal(PURE.isArray(33.33), false, 'Don\'t expect number literal to be an array.');
		equal(PURE.isArray('some string literal'), false, 'Don\'t expect string literal to be an array.');
		equal(PURE.isArray(new Str('some string literal')), false, 'Don\'t expect string object to be an array.');
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
		ok(PURE.isObject(new Num(4)), 'Expect number object to be an object.');
		ok(PURE.isObject(new Str('4')), 'Expect string object to be an object.');
		ok(PURE.isObject(new Bool(false)), 'Expect boolean object to be an object.');
		ok(PURE.isObject([1, 2, 3]), 'Expect array literal to be an object.');
		ok(PURE.isObject(new Arr(3)), 'Expect new Array() object to be an object.');
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
		strictEqual(PURE.typeOf(new Num(34)), 'object', 'Expect number object to be typeof "object".');
		strictEqual(PURE.typeOf(new Str('string')), 'object', 'Expect string object to be typeof "object".');
		strictEqual(PURE.typeOf(new Bool(true)), 'object', 'Expect boolean object to be typeof "object".');
		strictEqual(PURE.typeOf(null), 'null', 'Expect null to be typeof "null".');
		strictEqual(PURE.typeOf(undefined), 'undefined', 'Expect undefined to be typeof "undefined".');
		strictEqual(PURE.typeOf([1, 2, 3]), 'array', 'Expect array literal to be typeof "array".');
	});