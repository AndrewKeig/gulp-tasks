'use strict';

var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
	gulp.watch(['app/components/*.js', 'test/*.js'], ['lint', 'test', 'browserify']);

	gulp.watch(['gulp/tasks/*.js', 'gulpfile.js'], ['lint']);

	gulp.watch(['app/html/*.html'], ['html']);

	gulp.watch(['app/css/*.scss'], ['css']);

  livereload.listen();
 
  gulp.watch(['public/**'])
  	.on('change', livereload.changed);
});