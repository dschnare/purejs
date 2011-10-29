@echo off

set ifile=%1
set ofile=%~nx1
set ofile=bin\%ofile:.js=.min.js%

ajaxmin.exe -js -clobber -global:define,window "%ifile%" -out %ofile%