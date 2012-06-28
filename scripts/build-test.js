var fs = require('fs'),
	path = require('path'),
	concat = require('./lib/concat'),
	$4web = require('4web'),
	partialsDir = path.join(__dirname, '../test/js/_tests'),
	testsFile = path.join(__dirname, '../test/js/tests.js');

concat.concatThenSave(partialsDir, testsFile, function (error) {
	if (error) {
		console.error('Failed to concatenate files: ' + error);
	} else {
		$4web.build('test/js')
		.done(function (error) {
			if (error) {
				console.error(error.toString());
			}
		});
	}
});