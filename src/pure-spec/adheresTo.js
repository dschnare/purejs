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