'use strict';

var gulp   = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
	return gulp.src(['app/components/*.js', 'test/*.js', 'gulp/tasks/*.js', 'gulpfile.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'), { verbose: true })
		.pipe(jshint.reporter('fail'));
});
