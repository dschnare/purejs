pure.min.js: pure.js
  node_modules/.bin/uglifyjs pure.js -o pure.min.js

test: 
  node_modules/.bin/jasmine-node spec/

.PHONY: test