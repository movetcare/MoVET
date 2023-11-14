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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage-us.provetcloud.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "movetcare.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
    ],
  },
});
