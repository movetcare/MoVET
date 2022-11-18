const withTM = require("next-transpile-modules")([
  "ui",
  "utilities",
  "server",
  "types",
  "schemas",
  "constant",
]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});
