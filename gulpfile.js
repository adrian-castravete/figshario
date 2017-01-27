let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let uglify = require('gulp-uglify');
let watchify = require('watchify');

let sourcePath = "src/starter.js";
let targetPath = "js/figshario.js";

gulp.task('build', () => {
  return compile();
});

gulp.task('build-min', () => {
  return compile(true);
});

gulp.task('watch', () => {
  return compile(false, true);
});

function compile(minify = false, watch = false) {
  let bundler = browserify(sourcePath);
  let targetPathParts = targetPath.split('/');
  let targetName = targetPathParts[-1];
  targetPathParts.pop();
  let targetDir = targetPathParts.join('/');

  if (watch) {
    bundler = watchify(bundler);
  }
  bundler.transform(babelify, {presets: ['es2015']});

  bundler.on('update', rebundle);
  bundler.on('log', (...stuff) => {
    console.log(...stuff);
  });

  return rebundle();

  function rebundle() {
    let stream = bundler
      .bundle()
      .on('error', (...stuff) => {
        console.log(...stuff);
      })
      .pipe(source(targetName))
      .pipe(buffer());
    if (minify) {
      stream.pipe(uglify());
    }
    stream.pipe(gulp.dest(targetDir));
  }
}
