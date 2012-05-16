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