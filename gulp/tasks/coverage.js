'use strict';

var gulp   		= require('gulp');
var istanbul 	= require('gulp-istanbul');
var mocha 		= require('gulp-mocha');

var options = {
  dir: './coverage',
  reporters: [ 'html' ],
  reportOpts: { dir: './coverage' }
};

gulp.task('coverage', function (cb) {
  gulp.src(['app/components/*.js'])
    .pipe(istanbul()) 
    .pipe(istanbul.hookRequire()) 
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha({reporter: 'min'}))
        .pipe(istanbul.writeReports(options))
        .on('end', cb);
    });
});