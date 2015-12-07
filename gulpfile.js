var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');

gulp.task('build', function () {
  // set up the browserify instance on a task basis
  var b = browserify({entries: './src/starter.js', debug: true})
    .transform(babelify, {presets: ['es2015']});

  return b.bundle()
    .on('error', function (err) {
      console.error(err.toString());
      this.emit("end");
    })
    .pipe(source('figshario.js'))
    .pipe(buffer())
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
    .pipe(gulp.dest('./js/'));
});

gulp.task('watch', function () {
  return gulp.src('./src/**/*.js')
    .pipe(watch('./src/**/*.js'))
    .on('change', function (fileName) {
      console.info(fileName + ' changed; rebuilding');
      runSequence('build');
    });
});

gulp.task('default', ['build']);
