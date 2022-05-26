const { gulp, src, dest, watch, series, parallel } = require("gulp");
const del = require("del");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const size = require("gulp-size");
const rename = require("gulp-rename");
const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");

// CONFIG
const config = {
  server: {
    proxy: "http://localhost:8888/fraap.exp.dev/",
  },
  scss: {
    src: "theme/src/scss/",
    dest: "theme/dist/css/",
    loadPath: ["node_modules"],
  },
  css: {
    src: "theme/src/css",
    dest: "theme/dist/css",
  },
  js: {
    src: "theme/src/js/",
    dest: "theme/dist/js/",
    name: "fraap.js",
    modules: [
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
  },
  copy: {
    src: ["node_modules/focus-visible/dist/focus-visible.min.js"],
    dest: "theme/dist/js/polyfill/",
  },
  html: { src: "squelettes/**/*.html" },
  clean: [
    "theme/dist/css/*.css",
    "theme/dist/js/*.js",
    "!theme/dist/",
  ],
  tasks: {
    scss: true,
    js: true,
    clean: true,
    reload: true,
    copy: true,
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
  return src(config.scss.src + "**/*.scss")
    .pipe(
      sass
        .sync({ includePaths: config.scss.loadPath })
        .on("error", sass.logError)
    )
    .pipe(postcss())
    .pipe(size({ title: "CSS", gzip: true, showFiles: true }))
    .pipe(rename({ basename: "fraap" }))
    .pipe(dest(config.css.dest))
    .pipe(browserSync.stream());
};

// JS task
const js = function (done) {
  if (!config.tasks.js) return done();
  return rollup.rollup({
    input: config.js.src + "/index.js",
    plugins: [nodeResolve(), commonjs()],
  }).then(bundle => {
    return bundle.write({
      file: config.js.dest + config.js.name,
      format: "iife",
      plugins: [process.env.NODE_ENV === "production" && terser()]
    });
  });
}

// Copy task
const copy = (done) => {
  if (!config.tasks.copy) return done();
  return src(config.copy.src)
    .pipe(dest(config.copy.dest));
}

// Server task
const startServer = function (done) {
  if (!config.tasks.reload) return done();
  // Initialize BrowserSync
  browserSync.init({
    proxy: config.server.proxy
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
  watch(config.scss.src + "**/*.scss", series(scss));
  watch(config.js.src + "**/*.js", series(js, reloadBrowser));
  watch(config.html.src, series(reloadBrowser));
  done();
};

// Export tasks
exports.default = series(clean, parallel(scss, js));
exports.build = series(clean, parallel(scss, js));
exports.server = series(clean, parallel(scss, js), startServer, watchSource);
exports.clean = clean;
exports.js = js;
exports.copy = copy;
exports.scss = series(clean, scss);
