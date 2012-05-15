		typeSuite = (function () {
			var Str = String,
				Num = Number,
				Bool = Boolean,
				Arr = Array;

			return {
				isStringTest: function () {
					unit.expect('string literal to be a string.', PURE.isString('some string literal'));
					unit.expect('string object to be a string.', PURE.isString(new Str('some string literal')));
					unit.dontExpect('number literal to be a string.', PURE.isString(4));
					unit.dontExpect('number object to be a string.', PURE.isString(new Num(4)));
					unit.dontExpect('array literal to be a string.', PURE.isString([1, 2, 3]));
				},
				isBooleanTest: function () {
					unit.expect('boolean literal to be a boolean.', PURE.isBoolean(true));
					unit.expect('boolean object to be a boolean.', PURE.isBoolean(false));
					unit.dontExpect('number literal to be a boolean.', PURE.isBoolean(4));
					unit.dontExpect('number object to be a boolean.', PURE.isBoolean(new Num(4)));
					unit.dontExpect('array literal to be a boolean.', PURE.isBoolean([1, 2, 3]));
					unit.dontExpect('string literal to be a boolean.', PURE.isBoolean('some string literal'));
				},
				isNumberTest: function () {
					unit.expect('number literal integer to be a number.', PURE.isNumber(0));
					unit.expect('number literal float to be a number.', PURE.isNumber(12.23));
					unit.expect('number literal exponent to be a number.', PURE.isNumber(12e4));
					unit.expect('number object to be a number.', PURE.isNumber(new Num(12.34)));
					unit.dontExpect('array literal to be a number.', PURE.isNumber([1, 2, 3]));
					unit.dontExpect('string literal to be a number.', PURE.isNumber('some string literal'));
					unit.dontExpect('string object to be a number.', PURE.isNumber(new Str('some string literal')));
				},
				setupIsFunctionTest: function () {
					var F = function () {};
					F.prototype = Function.prototype;
					this.functionObject = new F();
				},
				isFunctionTest: function () {
					unit.expect('function literal to be a function.', PURE.isFunction(function () {}));
					unit.expect('function property to be a function.', PURE.isFunction(unit.makeTestSuite));
					unit.dontExpect('function object to be a function.', PURE.isFunction(this.functionObject));
					unit.dontExpect('number literal to be a function.', PURE.isFunction(10));
				},
				destroyIsFunctionTest: function (testName) {
					delete this.functionObject;
				},
				setupIsArrayTest: function () {
					// An array-like object (i.e. jQuery collection, etc.).
					this.arrayLikeObject = {
						length: 0,
						push: function () {}
					};

					// Extend the Array.prototype via prototypal inheritence.
					var A = function () {};
					A.prototype = Array.prototype;
					this.extendedArrayObject = new A();
				},
				isArrayTest: function () {
					unit.expect('array literal to be an array.', PURE.isArray([1, 2, 3]));
					unit.expect('array object to be an array.', PURE.isArray(new Arr(3)));
					unit.expect('array-like object to be an array.', PURE.isArray(this.arrayLikeObject));
					unit.expect('extended array object to be an array.', PURE.isArray(this.extendedArrayObject));
					unit.dontExpect('number literal to be an array.', PURE.isArray(33.33));
					unit.dontExpect('string literal to be an array.', PURE.isArray('some string literal'));
					unit.dontExpect('string object to be an array.', PURE.isArray(new Str('some string literal')));
				},
				destroyIsArrayTest: function () {
					delete this.arrayLikeObject;
					delete this.extendedArrayObject;
				},
				setupIsObjectTest: function () {
					this.setupIsArrayTest();
				},
				isObjectTest: function () {
					unit.expect('object literal to be an object.', PURE.isObject({key: 'value'}));
					unit.expect('number object to be an object.', PURE.isObject(new Num(4)));
					unit.expect('string object to be an object.', PURE.isObject(new Str('4')));
					unit.expect('boolean object to be an object.', PURE.isObject(new Bool(false)));
					unit.expect('array literal to be an object.', PURE.isObject([1, 2, 3]));
					unit.expect('array object to be an object.', PURE.isObject(new Arr(3)));
					unit.expect('extended array object to be an object.', PURE.isObject(this.extendedArrayObject));
					unit.expect('array-like object to be an object.', PURE.isObject(this.arrayLikeObject));
					unit.dontExpect('number literal to be an object.', PURE.isObject(1));
					unit.dontExpect('string literal to be an object.', PURE.isObject('1'));
					unit.dontExpect('boolean literal to be an object.', PURE.isObject(false));
				},
				destroyIsObjectTest: function () {
					this.destroyIsArrayTest();
				},
				isDefinedTest: function () {
					unit.expect('string literal to be defined.', PURE.isDefined('string'));
					unit.expect('number literal to be defined.', PURE.isDefined(45));
					unit.expect('array literal to be defined.', PURE.isDefined([2, 3, 4]));
					unit.dontExpect('undefined to be defined.', PURE.isDefined(undefined));
					unit.dontExpect('null to be defined.', PURE.isDefined(null));
				},
				isUndefinedTest: function () {
					unit.expect('undefined to be undefined.', PURE.isUndefined(undefined));
					unit.expect('null to be undefined.', PURE.isUndefined(null));
					unit.dontExpect('string literal to be undefined.', PURE.isUndefined('string'));
					unit.dontExpect('number literal to be undefined.', PURE.isUndefined(45));
					unit.dontExpect('array literal to be undefined.', PURE.isUndefined([2, 3, 4]));
				},
				typeOfTest: function () {
					unit.expect('number literal to be typeof "number".', PURE.typeOf(34) === 'number');
					unit.expect('string literal to be typeof "string".', PURE.typeOf('string') === 'string');
					unit.expect('boolean literal to be typeof "boolean".', PURE.typeOf(true) === 'boolean');
					unit.expect('function literal to be typeof "function".', PURE.typeOf(function () {}) === 'function');
					unit.expect('number object to be typeof "object".', PURE.typeOf(new Num(34)) === 'object');
					unit.expect('string object to be typeof "object".', PURE.typeOf(new Str('string')) === 'object');
					unit.expect('boolean object to be typeof "object".', PURE.typeOf(new Bool(true)) === 'object');
					unit.expect('null to be typeof "null".', PURE.typeOf(null) === 'null');
					unit.expect('undefined to be typeof "undefined".', PURE.typeOf(undefined) === 'undefined');
					unit.expect('array literal to be typeof "array".', PURE.typeOf([1, 2, 3]) === 'array');
				}
			};
		}());