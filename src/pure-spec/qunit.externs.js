function test(name, expected, test) {}
function asyncTest(name, expected, test) {}
function expect(amount) {}
function module(name, lifecycle) {}
function start(decrement) {}
function stop(increment) {}
function ok(state, message) {}
function equal(actual, expected, message) {}
function notEqual(actual, expected, message) {}
function deepEqual(actual, expected, message) {}
function notDeepEqual(actual, expected, message) {}
function strictEqual(actual, expected, message) {}
function notStrictEqual(actual, expected, message) {}
function raises(block, expected, message) {}

var QUnit = {
	log: function (callback) {},
	testStart: function (callback) {},
	testDone: function (callback) {},
	moduleStart: function (callback) {},
	moduleDone: function (callback) {},
	begin: function (callback) {},
	done: function (callback) {}
};