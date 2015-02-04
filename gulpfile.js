'use strict';

var gulp       = require('gulp');
var requireDir = require('require-dir');

requireDir('./gulp/tasks', { recurse: true });

gulp.task('default', 	
[ 
	'lint', 
	'test', 
	'browserify', 
	'html', 
	'css',
	'server', 
	'watch' 
]);
