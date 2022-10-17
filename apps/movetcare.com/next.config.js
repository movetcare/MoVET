const withTM = require("next-transpile-modules")(["ui", "utilities"]);

module.exports = withTM({
  reactStrictMode: true,
});
