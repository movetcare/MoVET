module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            app: "./app",
            assets: "./assets",
            components: "./components",
            constants: "./constants",
            contexts: "./contexts",
            hooks: "./hooks",
            services: "./services",
            utils: "./utils",
            tailwind: "./tailwind.ts",
            stores: "./stores",
            "firebase-config": "./firebase-config.ts",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
