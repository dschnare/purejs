var fs = require('fs'),
	path = require('path');

function concat(dir, fn) {
	var text = '';

	fn = typeof fn === 'function' ? fn : function() {};

	fs.readdir(dir, function (error, files) {
		if (error) {
			fn(error);
		} else {
			files.sort();

			if (files.every(function (file) {
				file = path.join(dir, file);

				try {
					if (fs.statSync(file).isFile()) {
						text += fs.readFileSync(file, 'utf8');
					}
				} catch (error) {
					fn(error);
					return false;
				}

				return true;
			})) {
				fn(null, text);
			}
		}
	});
}

function concatThenSave(dir, filename, fn) {
	fn = typeof fn === 'function' ? fn : function() {};

	concat(dir, function (error, text) {
		if (error) {
			fn(error);
		} else {
			fs.writeFile(filename, text, 'utf8', function (error) {
				if (error) {
					fn(error);
				} else {
					fn(null, text);
				}
			});
		}
	});
}

exports = module.exports = {
	concat: concat,
	concatThenSave: concatThenSave
};