load('tools/jslint.js');

if (!JSLINT(readFile(arguments[0], 'utf-8'))) {
    var i = 0,
        len = JSLINT.errors.length,
        error = null;

    for (i = 0; i < len; i += 1) {
        error = JSLINT.errors[i];

        print('Line: ' + error.line, '\nReason: ' + error.reason, '\nEvidence: ' + error.evidence.trim());
        print('\n');
    }
}