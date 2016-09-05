let browserify = require("browserify");
let babelify = require("babelify");
let gulp = require("gulp");
let source = require("vinyl-source-stream");
let buffer = require("vinyl-buffer");
// let uglify = require("gulp-uglify");
// let watch = require("gulp-watch");
// let runSequence = require("run-sequence");
// let plumber = require("gulp-plumber");

gulp.task("build", function() {
  // set up the browserify instance on a task basis
  let b = browserify({entries: "./src/starter.js", debug: true})
    .transform(babelify, {presets: ["es2015"]});

  return b.bundle()
    .on("error", function(err) {
      console.error(err.toString());
      this.emit("end");
    })
    .pipe(source("figshario.js"))
    .pipe(buffer())
        // Add transformation tasks to the pipeline here.
        // .pipe(uglify())
    .pipe(gulp.dest("./build/"));
});

gulp.task("default", ["build"]);
