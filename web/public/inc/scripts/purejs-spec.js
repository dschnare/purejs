/*
Author: Darren Schnare
Keywords: Keywords: javascript,constructor,inheritence,mixin,pure,type,testing
License: MIT ( http://www.opensource.org/licenses/mit-license.php )
Repo: https://github.com/dschnare/purejs
*/
(function (pure) {
	'use strict';

	var adheresToSuite = (function (pure, unit) {
		    'use strict';
		    /*global 'pure', 'window'*/
		
		    return {
		        wildCardAdheresToTest: function () {
		            unit.expect('object to adhereTo {age: "*"}.', pure.adheresTo({age: 23}, {age: '*'}));
		            unit.dontExpect('object to adhereTo {age: "*"}.', pure.adheresTo({age: undefined}, {age: '*'}));
		            unit.expect('object to adhereTo {age: "*"}.', pure.adheresTo({age: null}, {age: '*'}));
		            unit.expect('object to adhereTo {age: "*"}.', pure.adheresTo({age: {}}, {age: '*'}));
		            unit.dontExpect('object to adhereTo {age: "*"}.', pure.adheresTo({}, {age: '*'}));
		        },
		        adherenceTest: function () {
		            unit.expect('object to adhereTo Object.prototype.', pure.adheresTo({}, Object.prototype));
		            unit.expect('object to adhereTo {name: "string", age: "number"}.', pure.adheresTo({name: 'Darren', age: 29}, {name: 'string', age: 'number'}));
		        }
		    };
		}(pure, window.unit)),
		constructorSuite = (function (pure, unit) {
		    'use strict';
		    /*global 'pure', 'window'*/
		
		    return {
		        emptyConstructorTest: function () {
		            var Ctr = pure.constructor.create(),
		                ctr = Ctr,
		                o = new Ctr(),
		                j = ctr();
		
		            unit.expect('Ctr to be a function.', typeof Ctr === 'function');
		            unit.expect('o to be an instance of Ctr.', o instanceof Ctr);
		            unit.expect('j to be an instance of Ctr.', j instanceof Ctr);
		
		            if (typeof Object.prototype.isPrototypeOf === 'function') {
		                unit.expect('Ctr.prototype is a prototype of o.', Ctr.prototype.isPrototypeOf(o));
		                unit.expect('Ctr.prototype is a prototype of j.', Ctr.prototype.isPrototypeOf(j));
		            }
		            if (typeof Object.getPrototypeOf === 'function') {
		                unit.expect('prototype of o is equal to Ctr.prototype.', Object.getPrototypeOf(o) === Ctr.prototype);
		                unit.expect('prototype of j is equal to Ctr.prototype.', Object.getPrototypeOf(j) === Ctr.prototype);
		            }
		
		            unit.expect('Ctr.getName() equal to "UnnamedConstructor".', Ctr.getName() === 'UnnamedConstructor');
		        },
		        simpleConstructorTest: function () {
		            var Ctr = pure.constructor.create('CTR'),
		                ctr = Ctr,
		                o = new Ctr(),
		                j = ctr();
		
		            unit.expect('Ctr to be a function.', typeof Ctr === 'function');
		            unit.expect('o to be an instance of Ctr.', o instanceof Ctr);
		            unit.expect('j to be an instance of Ctr.', j instanceof Ctr);
		
		            if (typeof Object.prototype.isPrototypeOf === 'function') {
		                unit.expect('Ctr.prototype is a prototype of o.', Ctr.prototype.isPrototypeOf(o));
		                unit.expect('Ctr.prototype is a prototype of j.', Ctr.prototype.isPrototypeOf(j));
		            }
		            if (typeof Object.getPrototypeOf === 'function') {
		                unit.expect('prototype of o is equal to Ctr.prototype.', Object.getPrototypeOf(o) === Ctr.prototype);
		                unit.expect('prototype of j is equal to Ctr.prototype.', Object.getPrototypeOf(j) === Ctr.prototype);
		            }
		
		            unit.expect('Ctr.getName() equal to "CTR".', Ctr.getName() === 'CTR');
		        },
		        copyConstructorTest: function () {
		            var Ctr = pure.constructor.create({
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
		
		            unit.dontExpect('a to be identical to b.', a === b);
		            unit.expect('a.initCalled to be true.', a.initCalled === true);
		            unit.dontExpect('a.copyCalled to be true.', a.copyCalled === true);
		            unit.expect('b.initCalled to be true.', b.initCalled === true);
		            unit.expect('b.copyCalled to be true.', b.copyCalled === true);
		
		            unit.expect('a to be an instance of Ctr.', a instanceof Ctr);
		            unit.expect('b to be an instance of Ctr.', b instanceof Ctr);
		
		            if (typeof Object.prototype.isPrototypeOf === 'function') {
		                unit.expect('Ctr.prototype is a prototype of a.', Ctr.prototype.isPrototypeOf(a));
		                unit.expect('Ctr.prototype is a prototype of b.', Ctr.prototype.isPrototypeOf(b));
		            }
		            if (typeof Object.getPrototypeOf === 'function') {
		                unit.expect('prototype of a is equal to Ctr.prototype.', Object.getPrototypeOf(a) === Ctr.prototype);
		                unit.expect('prototype of b is equal to Ctr.prototype.', Object.getPrototypeOf(b) === Ctr.prototype);
		            }
		
		            unit.expect('Ctr.getName() equal to "CTR".', Ctr.getName() === 'CTR');
		        },
		        membersTest: function () {
		            var initCalled = false,
		                Ctr = pure.constructor.create({
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
		
		            unit.expect('Ctr to be a function.', typeof Ctr === 'function');
		            unit.expect('o to be an instance of Ctr.', o instanceof Ctr);
		            unit.expect('j to be an instance of Ctr.', j instanceof Ctr);
		
		            if (typeof Object.prototype.isPrototypeOf === 'function') {
		                unit.expect('Ctr.prototype is a prototype of o.', Ctr.prototype.isPrototypeOf(o));
		                unit.expect('Ctr.prototype is a prototype of j.', Ctr.prototype.isPrototypeOf(j));
		            }
		            if (typeof Object.getPrototypeOf === 'function') {
		                unit.expect('prototype of o is equal to Ctr.prototype.', Object.getPrototypeOf(o) === Ctr.prototype);
		                unit.expect('prototype of j is equal to Ctr.prototype.', Object.getPrototypeOf(j) === Ctr.prototype);
		            }
		
		            unit.expect('Ctr.getName() equal to "CTR".', Ctr.getName() === 'CTR');
		            unit.expect('initCalled to be true.', initCalled);
		            unit.expect('o.helloWorld() equal to "Hello World".', o.helloWorld() === 'Hello World');
		            unit.expect('o to adhere to Ctr.prototype.', pure.adheresTo(o, Ctr.prototype));
		        },
		        baseMembersTest: function () {
		            var personInitCalled = false,
		                ninjaInitCalled = false,
		                Person = pure.constructor.create({
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
		                Ninja = pure.constructor.create(Person, {
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
		
		            unit.expect('ninja to be an instance of Ninja.', ninja instanceof Ninja);
		            unit.expect('ninja to be an instance of Person.', ninja instanceof Person);
		
		            if (typeof Object.prototype.isPrototypeOf === 'function') {
		                unit.expect('Ninja.prototype is a prototype of ninja.', Ninja.prototype.isPrototypeOf(ninja));
		                unit.expect('Person.prototype is a prototype of ninja.', Person.prototype.isPrototypeOf(ninja));
		            }
		            if (typeof Object.getPrototypeOf === 'function') {
		                unit.expect('prototype of ninja is equal to Ninja.prototype.', Object.getPrototypeOf(ninja) === Ninja.prototype);
		                unit.dontExpect('prototype of ninja is equal to Person.prototype.', Object.getPrototypeOf(ninja) === Person.prototype);
		            }
		
		            unit.expect('ninja.getName() equal to "Darren is a Ninja".', ninja.getName() === 'Darren is a Ninja!');
		            unit.expect('Ninja.getName() equal to "Ninja".', Ninja.getName() === 'Ninja');
		            unit.expect('personInitCalled to be true.', personInitCalled);
		            unit.expect('ninjaInitCalled to be true.', ninjaInitCalled);
		            unit.expect('ninja.helloWorld() equal to "Hello World".', ninja.helloWorld() === 'Hello World');
		            unit.expect('ninja.helloWorld() equal to "Hello World".', ninja.helloWorld() === 'Hello World');
		            unit.expect('ninja to adhere to Ninja.prototype.', pure.adheresTo(ninja, Ninja.prototype));
		            unit.expect('ninja to adhere to Person.prototype.', pure.adheresTo(ninja, Person.prototype));
		        }
		    };
		}(pure, window.unit)),
		mixinSuite = (function (pure, unit) {
		    'use strict';
		    /*global 'pure', 'window'*/
		
		    return {
		        setupOwnPropertyTest: function () {
		            function create(o) {
		                function F() {}
		                F.prototype = o;
		                return new F();
		            }
		
		            this.a = {
		                name: 'Ninja',
		                age: 300
		            };
		
		            this.b = create(this.a);
		            this.b.stars = 800;
		            this.b.health = 1000;
		        },
		        ownPropertyTest: function () {
		            var o = pure.mixin({}, this.b);
		
		            unit.expect('o.stars to be equal to b.stars.', o.stars === this.b.stars);
		            unit.expect('o.health to equal to b.health.', o.health === this.b.health);
		            unit.dontExpect('o.name to be equal to a.name.', o.name === this.a.name);
		            unit.dontExpect('o.age to be equal to a.age.', o.age === this.a.age);
		        },
		        destroyOwnPropertyTest: function () {
		            delete this.a;
		            delete this.b;
		        },
		        setupOverwritePropertyTest: function () {
		            this.setupOwnPropertyTest();
		        },
		        overwritePropertyTest: function () {
		            this.b.age = 3500;
		            var o = pure.mixin(this.a, this.b);
		
		            unit.expect('o.name to be equal to a.name.', o.name === this.a.name);
		            unit.expect('o.age to be equal to 3500.', o.age === 3500);
		        },
		        destroyOverwritePropertyTest: function () {
		            this.destroyOwnPropertyTest();
		        },
		        objectCreationTest: function () {
		            var o = {},
		                j;
		
		            unit.expect('o to be an object.', typeof o === 'object');
		
		            j = pure.mixin(o, {age: 45});
		            unit.expect('o to be the same object as j.', o === j);
		
		            unit.expectToThrow('pure.mixin() to throw an error.', function () {
		                pure.mixin();
		            });
		
		            unit.expectToThrow('pure.mixin(null, {age: 45}) to throw an error.', function () {
		                pure.mixin(null, {age: 45});
		            });
		        }
		    };
		}(pure, window.unit)),
		typeSuite = (function (pure, unit) {
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

	unit.makeTestHarness('Purejs Test Harness',
		'AdheresTo Test Suite', adheresToSuite,
		'Constructor Test Suite', constructorSuite,
		'Mixin Test Suite', mixinSuite,
		'Type Test Suite', typeSuite).run();
}(window.PURE));