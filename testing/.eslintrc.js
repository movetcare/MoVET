module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    "no-undef": 0,
  },
};
