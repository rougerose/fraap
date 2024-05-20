let url = process.env.DDEV_HOSTNAME;

module.exports = {
  open: false,
  ui: false,
  proxy: url,
  host: url,
  // logLevel: "debug",
  files: [
    "./squelettes/**/*.html",
    "./theme/dist/js/*.js",
    "./theme/dist/css/*.css",
  ],
  ignore: ["./node_modules", "./vendor"],
};
