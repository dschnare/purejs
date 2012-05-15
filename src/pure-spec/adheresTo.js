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