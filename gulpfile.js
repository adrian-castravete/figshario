let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let uglify = require('gulp-uglify');
let watchify = require('watchify');

gulp.task('browserify', () => {
  let bundler = watchify(browserify('src/starter.js'))
    .transform(babelify, {presets: ['es2015']});

  bundler.on('update', rebundle);
  bundler.on('log', (...stuff) => {
    console.log(...stuff);
  });

  return rebundle();

  function rebundle() {
    return bundler
      .bundle()
      .on('error', (...stuff) => {
        console.log(...stuff);
      })
      .pipe(source('figshario.js'))
      .pipe(buffer())
      //.pipe(uglify())
      .pipe(gulp.dest('js'));
  }
});
