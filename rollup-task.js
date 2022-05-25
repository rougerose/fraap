const rollup = require("rollup").rollup;
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");

module.exports = (modules, callback) => {
  modules.forEach((module, i) => {
    rollup({
      input: module.input,
      plugins: [
        nodeResolve(),
        commonjs(),
      ],
    })
      .then((bundle) => {
        bundle.write({
          file: module.output,
          format: module.format,
          plugins: [process.env.NODE_ENV === "production" && terser()],
        });

        if (i === modules.length - 1) {
          callback();
        }
      });
  });
};
