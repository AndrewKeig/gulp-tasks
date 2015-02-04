'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename 			= require('gulp-rename');

gulp.task('css', function () {
  gulp.src('./app/css/*.{sass,scss}')
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({ browsers: [ 'last 2 version' ] }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));
});