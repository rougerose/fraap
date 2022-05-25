const { gulp, src, dest, watch, series, parallel } = require("gulp");
const del = require("del");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const size = require("gulp-size");
const rename = require("gulp-rename");
const rollup = require("./rollup-task");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");

// CONFIG
const config = {
  server: {
    proxy: "http://localhost:8888/fraap.exp.dev",
    notify: false,
  },
  scss: {
    src: "theme/src/scss",
    loadPath: ["node_modules"],
  },
  css: {
    src: "theme/src/css",
    dest: "theme/dist/css",
  },
  js: [
    {
      input: "theme/src/js/index.js",
      output: "theme/dist/js/fraap.js",
      format: "iife",
    },
    {
      input: "focus-visible/src/focus-visible.js",
      output: "theme/dist/js/polyfill/focus-visible.js",
      format: "umd",
    },
  ],
  html: { src: "squelettes/**/*.html" },
  clean: [
    "theme/dist/css/*.css",
    "theme/dist/js/*.js",
    "theme/dist/js/polyfill/*.js",
    "!theme/dist/",
  ],
  tasks: {
    scss: true,
    js: true,
    clean: true,
    reload: true,
  },
};

/// TASKS

// Clean task
const clean = function (done) {
  if (!config.tasks.clean) return done();
  del.sync(config.clean);
  return done();
};

// SCSS task
const scss = function (done) {
  if (!config.tasks.scss) return done();
  return src(config.scss.src + "/index.scss")
    .pipe(
      sass
        .sync({ includePaths: config.scss.loadPath })
        .on("error", sass.logError)
    )
    // .pipe(dest(config.css.src))
    .pipe(postcss())
    .pipe(size({ title: "CSS", gzip: true, showFiles: true }))
    .pipe(rename({ basename: "fraap" }))
    .pipe(dest(config.css.dest))
    .pipe(browserSync.stream());
};

// JS task
// Créer de multiples bundles js
// Source : https://gist.github.com/craigdmckenna/c420f58bf4fdb35ac8923365555f1fb0
const js = function (cb) {
  rollup(config.js, cb);
}

// Server task
const startServer = function (done) {
  if (!config.tasks.reload) return done();
  // Initialize BrowserSync
  browserSync.init({
    proxy: config.server.proxy,
  });
  done();
};

// Reload task
const reloadBrowser = function (done) {
  if (!config.tasks.reload) return done();
  browserSync.reload();
  done();
};

// Watch
const watchSource = function (done) {
  watch(config.scss.src + "/**/*.scss", series(scss, reloadBrowser));
  watch(config.js.src + "/**/*.js", series(js, reloadBrowser));
  watch(config.html.src, series(scss, reloadBrowser));
  done();
};


// Export tasks
exports.default = series(clean, parallel(scss, js));
exports.clean = clean;
exports.js = js;
exports.scss = series(clean, scss);
exports.dev = series(clean, parallel(scss, js));
exports.build = series(clean, parallel(scss, js));
exports.server = series(clean, parallel(scss, js), startServer, watchSource)
