const { gulp, src, dest, watch, series, parallel } = require("gulp");
const config = require("./gulp.config.js");
const del = require("del");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const size = require("gulp-size");
const rename = require("gulp-rename");
const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");

/**
 * Clean task
 */
const clean = function (done) {
  // Make sure this feature is activated before running
  if (!config.tasks.clean) return done();
  del.sync(config.clean);
  // Signal completion
  return done();
};

/**
 * SCSS task
 */
const scss = function (done) {
  if (!config.tasks.scss) return done();
  return src(config.scss.src + "/index.scss")
    .pipe(
      sass
        .sync({ includePaths: config.scss.loadPath })
        .on("error", sass.logError)
    )
    .pipe(dest(config.css.src))
    .pipe(postcss())
    // .pipe(rename({ basename: "styles" }))
    .pipe(size({ title: "CSS", gzip: true, showFiles: true }))
    .pipe(rename({ basename: "fraap" }))
    .pipe(dest(config.css.dest))
    .pipe(browserSync.stream());
};

/**
 * JS task
 */
const js = function (done) {
  if (!config.tasks.js) return done();
  return rollup
    .rollup({
      input: config.js.src + "/index.js",
      plugins: [
        nodeResolve(),
        process.env.NODE_ENV === "production" && terser(),
      ],
    })
    .then((bundle) => {
      return bundle.write({
        file: config.js.dest + "/" + config.js.name,
        format: "iife",
      });
    });
};


/**
 * Server task
 */
const startServer = function (done) {
  if (!config.tasks.reload) return done();
  // Initialize BrowserSync
  browserSync.init({
    proxy: config.server.proxy,
  });
  done();
};

/**
 * Reload task
 */
const reloadBrowser = function (done) {
  if (!config.tasks.reload) return done();
  browserSync.reload();
  done();
};

/**
 * Watch
 */
const watchSource = function (done) {
  watch(config.scss.src + "/**/*.scss", series(scss, reloadBrowser));
  watch(config.js.src + "/**/*.js", series(js, reloadBrowser));
  watch(config.html.src, series(scss, reloadBrowser));
  done();
};

/**
 * Export tasks
 */

exports.default = series(clean, parallel(scss, js), startServer, watchSource);
exports.clean = clean;
exports.scss = series(clean, scss);
exports.dev = series(clean, parallel(scss, js));
exports.build = series(clean, parallel(scss, js));
