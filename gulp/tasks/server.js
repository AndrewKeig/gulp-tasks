'use strict';

var express = require('express');
var gulp = require('gulp');

gulp.task('server', function(next) {
  var app = express();
  app.use(express.static(__dirname + '/../../public'));
  return app.listen(3000, next);
});
