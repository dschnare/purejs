var unit = {
	dontExpect: function() {},
	dontExpectToThrow: function() {},
	expect: function() {},
	expectToThrow: function() {},
	fail: function() {},
	log: function() {},
	/** @return {{name: string, run: function () {}}} */
	makeTest: function() {},
	/** @return {{name: string, run: function () {}}} */
	makeTestHarness: function() {},
	/** @return {{name: string, run: function () {}}} */
	makeTestSuite: function() {},
	console: {
		appendChild: function () {},
		error: function () {},
		fail: function () {},
		getStyle: function () {},
		heading: function () {},
		hide: function () {},
		normal: function () {},
		pass: function () {},
		setStyle: function () {},
		show: function () {},
		success: function () {},
		trace: function () {}
	}
};