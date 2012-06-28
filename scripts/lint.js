var cwd = process.cwd(),
	fs = require('fs'),
	jslint = require('jslint-core').JSLINT;

fs.readFile('main.js', 'utf8', function (error, text) {
	if (error) {
		console.error(error);
	} else {
		if (jslint(text)) {
			console.log('main.js is OK');
		} else {
			jslint.errors.forEach(function (e) {
				if (e) {
					console.log('Line:', e.line, 'Charcter:', e.character);
					console.log('Reason:', e.reason);
					console.log('Evidence:', e.evidence);
					console.log('');
				}
			});
		}
	}
});