const withTM = require("next-transpile-modules")([
  "ui",
  "utilities",
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
  images: { domains: ["storage-us.provetcloud.com", "movetcare.com"] },
});
