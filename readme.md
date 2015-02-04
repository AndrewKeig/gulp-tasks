

#Gulp - a streaming build system.

Gulp is a streaming build system built on node.js.  It utilises node streams enabling; in most cases a fairly fast build process.  Plugins are written using node.js, using code over configuration.  Search npm for [gulpplugin](https://www.npmjs.com/search?q=gulpplugin) and [gulpfriendly](https://www.npmjs.com/search?q=gulpfriendly) to see the already large selection of gulp plugins.

This post will demonstrate setting up a gulp build task for a typical web application development workflow.  This includes:

- Linting with Jshint
- Running tests with Mocha
- Running code coverage with Istanbul
- Running browersify, to make node modules browser compatible with sourcemaps
- Running Uglify to concatenate and minifiy
- Running sass including minification with sourcemaps and autoprefixer
- Reloading a web application with livereload
- Repeating the above when files are updated

The source code for this post is here: 

[https://github.com/AndrewKeig/gulp-tasks](https://github.com/AndrewKeig/gulp-tasks)


##Gulp API

Lets look at the Gulp api; it basically uses 4 methods to constuct a build task:

`gulp.task` registers a task by name and allows you to sequence dependencies to be executed before your task will run.
```javascript
gulp.task('default', ['dependencies'], function() {
	...
});

```

`gulp.src` reads file(s) from a [node-glob](https://github.com/isaacs/node-glob) pattern into memory and returns a readable stream.
```javascript
gulp.task('build', function() {
	return gulp.src('src/*.js');
});
```

`gulp.dest` returns a writable stream to a destination folder.

```javascript
gulp.task('build', function() {
	return gulp.src('src/*.js')
		.pipe(gulp.dest('public/js'));
});
```

`gulp.watch` watches a glob pattern and run a function on file change. 


```javascript

gulp.task('watch', function() {
	gulp.watch(['src/*.js'], ['build']);
});
```


##Setup Gulp


First install gulp globally

```sh
$ npm install --global gulp
```

You should also install gulp to your project devDependencies

```sh
$ npm install --save-dev gulp
```

You can run gulp with the following command; which will run the default task

```sh
$ gulp
```
You can also specify a task name

```sh
$ gulp build
```

##Defining a task

Lets define a default task which execute a list of dependency tasks in sequence.

```javascript
var gulp       = require('gulp');
var requireDir = require('require-dir');

requireDir('./tasks', { recurse: true });

gulp.task('default', 	['lint', test', 'coverage', build', 'watch']);
```

Here we are using `require-dir` which allows us to split up gulp tasks into separate files, `requireDir('./tasks')` will pull them all into our main gulp file.


####Lint

Lets create a `lint` task, that allows us to lint our codebase.

```javascript
var jshint = require('gulp-jshint');
var gulp   = require('gulp');

gulp.task('lint', function() {
	return gulp.src(['src/*.js', 'test/*.js', 'tasks/*.js', 'gulpfile.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'), { verbose: true })
		.pipe(jshint.reporter('fail'));
});
```

####Running Tests

Lets create a `test` task, that allows us to lint our codebase.

```javascript
var gulp 	= require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
	return gulp.src('test/*.js', {read: false})
		.pipe(mocha({reporter: 'min'}));
});
```

####Code coverage

```javascript
var gulp   		= require('gulp');
var istanbul 	= require('gulp-istanbul');
var mocha 		= require('gulp-mocha');

var options = {
  dir: './coverage',
  reporters: [ 'html' ],
  reportOpts: { dir: './coverage' }
};

gulp.task('coverage', function (cb) {
  gulp.src(['src/*.js'])
    .pipe(istanbul()) 
    .pipe(istanbul.hookRequire()) 
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha({reporter: 'min'}))
        .pipe(istanbul.writeReports(options))
        .on('end', cb);
    });
});
```

####Build task
So lets break down an example, consider the following concatanation and minification build task:

```javascript
var gulp   = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('build', function() {
	return gulp.src('src/*.js')  		 //read file(s)
		.pipe(concat('app.js'))  		 //concat files
		.pipe(uglify()) 				  //concat files
		.pipe(rename({suffix: '.min'}))   //rename files
		.pipe(gulp.dest('public/js'));	//write file(s)
});
```

We start by defining a gulp task called `build` by calling `gulp.task('build' fn)`.`gulp.src` reads file(s) from `src/*.js` into a readable stream of objects representing those files.  The stream is piped using `pipe()` to `concat()`, which concatenates the files to a single file `app.js`.  A transform stream is then piped to `uglify()` and minifies the source.  A transform stream is then piped to `rename()` which renames the file with a `.min` suffix.  `gulp.dest()` will return a writable stream saving the file `app.min.js` to a destination folder `public/js`.



##Watching tasks


We would like to re-run this build task when changes are made to source.  This is easily achieved with gulp using `gulp.watch`.

```javascript
var gulp = require('gulp');

gulp.task('watch', function() {
	gulp.watch(['src/*.js', 'tasks/*.js', 'gulpfile.js'], ['default']);
});

```





..