var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var coffee = require('gulp-coffee');

gulp.task('coffee', function () {
	return gulp.src('./src/**/*.coffee')
	  .pipe(plumber())
	  .pipe(coffee({bare: true}))
	  .pipe(gulp.dest('./src/'))
});

gulp.task('build', function () {
  // set up the browserify instance on a task basis
  var b = browserify({entries: './src/starter.js', debug: true});

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
  return gulp.src('./src/**/*.coffee')
    .pipe(watch('./src/**/*.coffee'))
    .on('change', function (fileName) {
      console.info(fileName + ' changed; rebuilding');
      runSequence('coffee', 'build');
    });
});

gulp.task('default', ['build']);
