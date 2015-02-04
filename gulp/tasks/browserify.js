'use strict';

var browserify 	= require('browserify');
var gulp 				= require('gulp');
var source 			= require('vinyl-source-stream');
var buffer 			= require('vinyl-buffer');
var uglify 			= require('gulp-uglify');
var sourcemaps 	= require('gulp-sourcemaps');

gulp.task('browserify', function () {
	var bundler = browserify({
    entries: ['./app/components/app.js'],
    debug: true
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source('app.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
       .pipe(uglify())
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./public/js'));
  };

  return bundle();
});