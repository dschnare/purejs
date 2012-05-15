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