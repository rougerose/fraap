module.exports = {
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
  js: {
    src: ["theme/src/js"],
    dest: "theme/dist/js",
    name: "fraap.js",
  },
  html: {
    src: "squelettes/**/*.html",
  },
  clean: ["theme/dist/css/*.css", "theme/dist/js/*.js", "!theme/dist/"],
  tasks: {
    scss: false,
    js: true,
    clean: false,
    reload: false,
  },
};
