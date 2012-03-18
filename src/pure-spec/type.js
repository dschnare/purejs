(function (pure, unit) {
    'use strict';
    /*global 'pure', 'window'*/

    var Str = String,
        Num = Number,
        Bool = Boolean,
        Arr = Array;

    return {
        isStringTest: function () {
            unit.expect('string literal to be a string.', pure.isString('some string literal'));
            unit.expect('string object to be a string.', pure.isString(new Str('some string literal')));
            unit.dontExpect('number literal to be a string.', pure.isString(4));
            unit.dontExpect('number object to be a string.', pure.isString(new Num(4)));
            unit.dontExpect('array literal to be a string.', pure.isString([1, 2, 3]));
        },
        isBooleanTest: function () {
            unit.expect('boolean literal to be a boolean.', pure.isBoolean(true));
            unit.expect('boolean object to be a boolean.', pure.isBoolean(false));
            unit.dontExpect('number literal to be a boolean.', pure.isBoolean(4));
            unit.dontExpect('number object to be a boolean.', pure.isBoolean(new Num(4)));
            unit.dontExpect('array literal to be a boolean.', pure.isBoolean([1, 2, 3]));
            unit.dontExpect('string literal to be a boolean.', pure.isBoolean('some string literal'));
        },
        isNumberTest: function () {
            unit.expect('number literal integer to be a number.', pure.isNumber(0));
            unit.expect('number literal float to be a number.', pure.isNumber(12.23));
            unit.expect('number literal exponent to be a number.', pure.isNumber(12e4));
            unit.expect('number object to be a number.', pure.isNumber(new Num(12.34)));
            unit.dontExpect('array literal to be a number.', pure.isNumber([1, 2, 3]));
            unit.dontExpect('string literal to be a number.', pure.isNumber('some string literal'));
            unit.dontExpect('string object to be a number.', pure.isNumber(new Str('some string literal')));
        },
        setupIsFunctionTest: function () {
            var F = function () {};
            F.prototype = Function.prototype;
            this.functionObject = new F();
        },
        isFunctionTest: function () {
            unit.expect('function literal to be a function.', pure.isFunction(function () {}));
            unit.expect('function property to be a function.', pure.isFunction(unit.makeTestSuite));
            unit.dontExpect('function object to be a function.', pure.isFunction(this.functionObject));
            unit.dontExpect('number literal to be a function.', pure.isFunction(10));
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
            unit.expect('array literal to be an array.', pure.isArray([1, 2, 3]));
            unit.expect('array object to be an array.', pure.isArray(new Arr(3)));
            unit.expect('array-like object to be an array.', pure.isArray(this.arrayLikeObject));
            unit.expect('extended array object to be an array.', pure.isArray(this.extendedArrayObject));
            unit.dontExpect('number literal to be an array.', pure.isArray(33.33));
            unit.dontExpect('string literal to be an array.', pure.isArray('some string literal'));
            unit.dontExpect('string object to be an array.', pure.isArray(new Str('some string literal')));
        },
        destroyIsArrayTest: function () {
            delete this.arrayLikeObject;
            delete this.extendedArrayObject;
        },
        setupIsObjectTest: function () {
            this.setupIsArrayTest();
        },
        isObjectTest: function () {
            unit.expect('object literal to be an object.', pure.isObject({key: 'value'}));
            unit.expect('number object to be an object.', pure.isObject(new Num(4)));
            unit.expect('string object to be an object.', pure.isObject(new Str('4')));
            unit.expect('boolean object to be an object.', pure.isObject(new Bool(false)));
			unit.expect('array literal to be an object.', pure.isObject([1, 2, 3]));
			unit.expect('array object to be an object.', pure.isObject(new Arr(3)));
			unit.expect('extended array object to be an object.', pure.isObject(this.extendedArrayObject));
			unit.expect('array-like object to be an object.', pure.isObject(this.arrayLikeObject));
            unit.dontExpect('number literal to be an object.', pure.isObject(1));
			unit.dontExpect('string literal to be an object.', pure.isObject('1'));
			unit.dontExpect('boolean literal to be an object.', pure.isObject(false));
        },
        destroyIsObjectTest: function () {
            this.destroyIsArrayTest();
        },
        isDefinedTest: function () {
            unit.expect('string literal to be defined.', pure.isDefined('string'));
            unit.expect('number literal to be defined.', pure.isDefined(45));
            unit.expect('array literal to be defined.', pure.isDefined([2, 3, 4]));
            unit.dontExpect('undefined to be defined.', pure.isDefined(undefined));
            unit.dontExpect('null to be defined.', pure.isDefined(null));
        },
        isUndefinedTest: function () {
            unit.expect('undefined to be undefined.', pure.isUndefined(undefined));
            unit.expect('null to be undefined.', pure.isUndefined(null));
            unit.dontExpect('string literal to be undefined.', pure.isUndefined('string'));
            unit.dontExpect('number literal to be undefined.', pure.isUndefined(45));
            unit.dontExpect('array literal to be undefined.', pure.isUndefined([2, 3, 4]));
        },
        typeOfTest: function () {
            unit.expect('number literal to be typeof "number".', pure.typeOf(34) === 'number');
            unit.expect('string literal to be typeof "string".', pure.typeOf('string') === 'string');
            unit.expect('boolean literal to be typeof "boolean".', pure.typeOf(true) === 'boolean');
            unit.expect('function literal to be typeof "function".', pure.typeOf(function () {}) === 'function');
            unit.expect('number object to be typeof "object".', pure.typeOf(new Num(34)) === 'object');
            unit.expect('string object to be typeof "object".', pure.typeOf(new Str('string')) === 'object');
            unit.expect('boolean object to be typeof "object".', pure.typeOf(new Bool(true)) === 'object');
            unit.expect('null to be typeof "null".', pure.typeOf(null) === 'null');
            unit.expect('undefined to be typeof "undefined".', pure.typeOf(undefined) === 'undefined');
            unit.expect('array literal to be typeof "array".', pure.typeOf([1, 2, 3]) === 'array');
        }
    };
}(pure, window.unit));