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
  images: {
    remotePatterns: [
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
