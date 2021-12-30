module.exports = ({ env }) => ({
  plugins: [
    require("autoprefixer"),
    env === "production" ? require("postcss-csso")() : false,
  ],
});
