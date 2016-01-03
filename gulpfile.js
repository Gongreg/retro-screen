var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');

function handleErrors(e) {
    console.log('ERROR!');
    console.log(e);
    this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(watch) {
  var bundler = browserify(
      'client/app.js',
      {
          cache: {},
          packageCache: {},
          debug: true,
          fullPaths: true,
      }
  ).transform(babelify, {presets: ['es2015', 'react']})

  // watchify() if watch requested, otherwise run browserify() once
  if (watch) {
      bundler = watchify(bundler);
  }


  function rebundle() {
    var stream = bundler.bundle();

    return stream
      .on('error', handleErrors)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/js'));
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  bundler.on('time', function(time) {
      gutil.log('Finished bundling in: ' + time);
  });

  // run it once the first time buildScript is called
  return rebundle();
}


// run once
gulp.task('scripts', function() {
  return buildScript(false);
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['scripts'], function() {
  return buildScript(true);
});
