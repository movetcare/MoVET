const movetTheme = require("../../packages/ui/tailwind.config");
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/components/**/*.{js,ts,jsx,tsx}",
    "../../packages/utilities/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: movetTheme,
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
