'use strict';

var gulp       	= require('gulp');
var requireDir 	= require('require-dir');
var runSequence = require('run-sequence');

requireDir('./gulp/tasks', { recurse: true });

gulp.task('default', function(callback) {
  runSequence('lint', 
	'test', 
	'browserify', 
	'html', 
	'css',
	'server', 
	'watch' , callback);
});