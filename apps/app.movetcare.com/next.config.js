const withTM = require("next-transpile-modules")([
  "ui",
  "utilities",
  "types",
  "schemas",
  "constant",
  "server",
]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["localhost", "storage-us.provetcloud.com", "googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
    ],
  },
});
