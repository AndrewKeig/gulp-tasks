'use strict';

var gulp   = require('gulp');

gulp.task('html', function() {
	return gulp.src('./app/html/*.html')
		.pipe(gulp.dest('./public'));
});
