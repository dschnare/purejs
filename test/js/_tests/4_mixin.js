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

	test('overwrite property test', function () {
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