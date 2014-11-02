'use strict'

var gulp = require('gulp')
  , coffee = require('gulp-coffee')
  , gutil = require('gulp-util')
  , coffeelint = require('gulp-coffeelint')
  , jasmine = require('gulp-jasmine')

gulp.task('default', function () {
  gulp.start('test')
})

gulp.task('test', ['coffee'], function () {
  return gulp.src('./spec/*.js')
    .pipe(jasmine({
      reporter: 'object',
      verbose: true,
      includeStackTrace: true
    }))
})

gulp.task('coffee', ['lint'], function () {
  return gulp.src('./src/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./'))
})

gulp.task('lint', function () {
  return gulp.src('./src/**/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'))
})