

#Gulp - a streaming build system.

Gulp is a streaming build system built on node.js.  It utilises node streams enabling; in most cases a fairly fast build process.  Plugins are written using node.js, using code over configuration.  Search npm for [gulpplugin](https://www.npmjs.com/search?q=gulpplugin) and [gulpfriendly](https://www.npmjs.com/search?q=gulpfriendly) to see the already large selection of gulp plugins.

Gulp is a rather elegant solution to setting up a build system.  Gulp tasks work with a file(s) source, the files at that source are read into memory which returns a stream, the stream is piped through a series of gulp plugins which transform that stream, the result of which is saved to a destination source.

This post will demonstrate setting up gulp tasks for a typical web application development workflow.  This includes:

- Linting with Jshint
- Test with Mocha
- Browersify node.js modules for the client
- Uglify for concatenation and minification
- Sass including minification with autoprefixer
- Sourcemaps for javascript and css
- Watch files and perform tasks
- Livereload to reload a web application
- Code coverage with Istanbul
- Bump version

The source code for this post is here:

[https://github.com/AndrewKeig/gulp-tasks](https://github.com/AndrewKeig/gulp-tasks)


##Gulp API

Lets look at the Gulp api; it basically uses 4 methods to constuct a build task:

`gulp.task` registers a task by name and allows you to sequence dependencies to be executed before the task runs.
```javascript
gulp.task('default', ['dependencies'], function() {
	...
});

```

`gulp.src` reads file(s) from a [node-glob](https://github.com/isaacs/node-glob) pattern into memory and returns a readable stream.
```javascript
gulp.task('default', function() {
	return gulp.src('src/*.js');
});
```

`gulp.dest` returns a writable stream to a destination folder.

```javascript
gulp.task('default', function() {
	return gulp.src('src/*.js')
		.pipe(gulp.dest('public/js'));
});
```

`gulp.watch` watches a glob pattern and runs a function on file change. 


```javascript

gulp.task('watch', function() {
	gulp.watch(['src/*.js'], ['build']);
});
```


##Setup & Run Gulp


First install gulp globally

```sh
$ npm install --global gulp
```

You should also install gulp to `devDependencies` in your `package.json` file

```sh
$ npm install --save-dev gulp
```

You can run the default gulp task with the following command

```sh
$ gulp
```
You can also run a gulp task by name

```sh
$ gulp lint
```

##Setup a default task

Gulp tasks are stored in a `gulpfile.js`. We can create a `default` task using `gulp.task('default', ['dependencies'])` which registers a task by name and specifies a list of dependencies to be executed in sequence.  Here he specify all of the tasks we would like to run as part of our workflow.

Below we are using `require-dir` which allows us to split up gulp tasks into separate files, `requireDir('./tasks')` will pull them all into our main `gulpfile`.

```javascript
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


```


####Lint

Lets create a `lint` task, that allows us to lint our entire codebase.  We start by defining a gulp task called `lint` by calling `gulp.task('lint' fn)`.  `gulp.src(['sources'])` which reads file(s) from an array of sources into a readable stream of objects representing those files.  The stream is piped using `pipe()` to `jshint()`, which performs linting using rules defined in `.jshintrc` file.  Jshint has multiple reporters, we pipe the stream to `jshint.reporter` which reports the results.


```javascript
'use strict';

var gulp   = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
	return gulp.src(['app/components/*.js', 'test/*.js', 'gulp/tasks/*.js', 'gulpfile.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'), { verbose: true })
		.pipe(jshint.reporter('fail'));
});

```



####Test

The following task `test` uses `Mocha` to run all tests located `test/*.js`.  The call to `gulp.src()` takes an options object, `{read: false}`, which simply means, do not read the file content into memory.

```javascript
'use strict';

var gulp  = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
	return gulp.src('test/*.js', {read: false})
		.pipe(mocha({reporter: 'min'}));
});

```

####CSS/SASS

The following task `css`, is fairly complex, we read all files of type `sass,scss` from `./app/css/*`.  First we `rename` the file, ading a `min` suffix.  We would like to generate sourcemaps so we pipe to `sourcemaps.init()`, which in turn pipes to `sass()`, which takes an options object `{outputStyle: 'compressed'}` and compresses the output.  `autoprefixer()` will add vendor prefixes to CSS rules for the last two browser versions. We then write the `sourcemaps` to location './maps', which is actually written to the folder './public/css/maps', finally the css files are written to './public/css`.

```javascript
'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');

gulp.task('css', function () {
  gulp.src('./app/css/*.{sass,scss}')
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({ browsers: [ 'last 2 version' ] }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));
});
```

###HTML
The following task `html` is simple, we read our `html` files from `'./app/html/*.html'` and pipe to `minifyHTML()` which minifies the content.  We also use `replace90` to add some version information to the page title and write the html files to `'./public'`.

```javascript
'use strict';

var gulp   		= require('gulp');
var minifyHTML 	= require('gulp-minify-html');
var replace    	= require('gulp-replace');
var pkg		    = require('../../package');

gulp.task('html', function() {
	return gulp.src('./app/html/*.html')
		.pipe(minifyHTML())
		.pipe(replace('{title}', pkg.description + ' - ' + pkg.version))
		.pipe(gulp.dest('./public'));
});
```

###Browserify

The following task `browserify`, will browserify our scripts with minification and sourcemaps.  `gulp-browserify` is no longer required and we can simply use the various `vinyl` packages; browserify has its own streaming api.

*Note: this is actually the preferred course of action if a module has a streaming api.*

We start by creating a `browserify` object which takes an object with entries `'./app/components/app.js'` a list of files to browserify and `debug` which enables sourcemaps.  We then use `source` to create a text stream and rename the file `app.min.js`.  We now pipe to `buffer()` which creates a stream transform, and use `sourcemaps.init()` to start the sourcemaps process. We then minify the scripts by calling `uglify()`, and write the sourcemaps to location `./maps`.  The browserified scripts are written to `./public/js`.

```javascript
'use strict';

var browserify = require('browserify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

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
```

####Server
The following task `server`, simply starts an `express` server, and serves statics from a `public` folder.

```javascript
'use strict';

var express = require('express');
var gulp    = require('gulp');

gulp.task('server', function(next) {
  var app = express();
  app.use(express.static(__dirname + '/../../public'));
  return app.listen(3000, next);
});

```


##Watch & Livereload


We would like to re-run tasks when changes are made to source.  This is easily achieved with gulp using `gulp.watch`.

This statement will execute when we make changes to our scripts or tests:
```
gulp.watch(['app/components/*.js', 'test/*.js'], ['lint', 'test', 'browserify']);
```
This statement will execute when we make changes to our gulpfiles and taks:
```
gulp.watch(['gulp/tasks/*.js', 'gulpfile.js'], ['lint']);
```
This statement will execute when we make changes to our html:
```
gulp.watch(['app/html/*.html'], ['html']);
```
This statement will execute when we make changes to our css:
```
gulp.watch(['app/css/*.scss'], ['css']);
```

We also setup livereload by calling `livereload.listen()`; and we have set livereload up to run on any code change:

```
gulp.watch(['public/**'])
      .on('change', livereload.changed);
```

```javascript
'use strict';

var gulp       = require('gulp');
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
```

####Code coverage
The following task `coverage`, is not included in the main `default` workflow, it will run code coverage with `Istanbul`.  We start by specifying the location of our code to test, `app/components/*.js`.  We pipe to `istanbul()` and add a handler for on `finish`. When Istanbul has finished analysing our source we run the tests at location `test/*.js` using Mocha; Istanbul writes the coverage reports to `./coverage`, in `html` format.

```javascript
'use strict';

var gulp     = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha    = require('gulp-mocha');

var options = {
  dir: './coverage',
  reporters: [ 'html' ],
  reportOpts: { dir: './coverage' }
};

gulp.task('coverage', function (cb) {
  gulp.src(['app/components/*.js'])
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

####Bump
The following task `bump` is not included in the main `default` workflow, it simply reads our `package.json` file and will `bump()` the version number with `minor` numbers, writing the file back to root.

```javascript
'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');

gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});
```






..