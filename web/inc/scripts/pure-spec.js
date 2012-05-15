(function () {
	'use strict';
	var adheresToSuite = {
			wildCardAdheresToTest: function () {
				unit.expect('object to adhereTo {age: "*"}.', PURE.adheresTo({age: 23}, {age: '*'}));
				unit.dontExpect('object to adhereTo {age: "*"}.', PURE.adheresTo({age: undefined}, {age: '*'}));
				unit.expect('object to adhereTo {age: "*"}.', PURE.adheresTo({age: null}, {age: '*'}));
				unit.expect('object to adhereTo {age: "*"}.', PURE.adheresTo({age: {}}, {age: '*'}));
				unit.dontExpect('object to adhereTo {age: "*"}.', PURE.adheresTo({}, {age: '*'}));
			},
			adherenceTest: function () {
				unit.expect('object to adhereTo Object.prototype.', PURE.adheresTo({}, Object.prototype));
				unit.expect('object to adhereTo {name: "string", age: "number"}.', PURE.adheresTo({name: 'Darren', age: 29}, {name: 'string', age: 'number'}));
			}
		},
		constructorSuite = {
			emptyConstructorTest: function () {
				var Ctr = PURE.constructor.create(),
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
				var Ctr = PURE.constructor.create('CTR'),
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
				unit.expect('o to adhere to Ctr.prototype.', PURE.adheresTo(o, Ctr.prototype));
			},
			baseMembersTest: function () {
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
				unit.expect('ninja to adhere to Ninja.prototype.', PURE.adheresTo(ninja, Ninja.prototype));
				unit.expect('ninja to adhere to Person.prototype.', PURE.adheresTo(ninja, Person.prototype));
			}
		},
        mixinSuite = {
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
                var o = PURE.mixin({}, this.b);

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
                var o = PURE.mixin(this.a, this.b);

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

                j = PURE.mixin(o, {age: 45});
                unit.expect('o to be the same object as j.', o === j);

                unit.expectToThrow('PURE.mixin() to throw an error.', function () {
                    PURE.mixin();
                });

                unit.expectToThrow('PURE.mixin(null, {age: 45}) to throw an error.', function () {
                    PURE.mixin(null, {age: 45});
                });
            }
        },
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
	unit.makeTestHarness('Purejs Test Harness',
		'AdheresTo Test Suite', adheresToSuite,
		'Constructor Test Suite', constructorSuite,
		'Mixin Test Suite', mixinSuite,
		'Type Test Suite', typeSuite).run();
}());