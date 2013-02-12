@ECHO off

IF "%1"=="test" GOTO TEST
GOTO BUILD

:BUILD
node_modules\.bin\uglifyjs pure.js -o pure.min.js
GOTO:eof

:TEST
node_modules\.bin\jasmine-node spec/
GOTO:eof