const { src, dest, series, watch } = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const browserSync = require("browser-sync").create();

// FOR SCSS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

// NUNJUCKS TASK
function runTask() {
  return src(["pages/*.html"])
    .pipe(
      nunjucksRender({
        path: ["pages/"], // String or Array
      })
    )
    .pipe(dest(["dist"]));
}

// Sass Task
function scssTask() {
  return src("scss/index.scss", { sourcemaps: true })
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("assets/css", { sourcemaps: "." }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browserSync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("pages/**/*.html", series(runTask, browsersyncReload));
  watch(
    ["scss/**/*.scss", "assets/js/*.js"],
    series(scssTask, browsersyncReload)
  );
}

exports.default = series(runTask, scssTask, browsersyncServe, watchTask);
