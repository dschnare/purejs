(function (pure) {
	'use strict';

	var adheresToSuite = {{adheresTo}},
		constructorSuite = {{constructor}},
		mixinSuite = {{mixin}},
		typeSuite = {{type}};

	unit.makeTestHarness('Purejs Test Harness',
		'AdheresTo Test Suite', adheresToSuite,
		'Constructor Test Suite', constructorSuite,
		'Mixin Test Suite', mixinSuite,
		'Type Test Suite', typeSuite).run();
}(window.PURE));