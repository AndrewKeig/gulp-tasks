'use strict';

var gulp   			= require('gulp');
var minifyHTML 	= require('gulp-minify-html');
var replace 		= require('gulp-replace');
var pkg		   		= require('../../package');

gulp.task('html', function() {
	return gulp.src('./app/html/*.html')
		.pipe(minifyHTML())
		.pipe(replace('{title}', pkg.description + ' - ' + pkg.version))
		.pipe(gulp.dest('./public'));
});