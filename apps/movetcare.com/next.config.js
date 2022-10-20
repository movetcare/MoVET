const withTM = require("next-transpile-modules")(["ui", "utilities", "server"]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: { domains: ["images.unsplash.com", "storage-us.provetcloud.com"] },
  experimental: {
    nextScriptWorkers: true,
  },
});
