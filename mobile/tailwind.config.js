const colors = require('tailwindcss/colors');
module.exports = {
  content: {
    enabled: true,
    content: [
      './screens/**/*',
      '/app/**/*',
      './components/**/*',
      './hooks/**/*',
    ],
  },
  // darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'movet-red': '#E76159',
      'movet-black': '#232127',
      'movet-white': '#f6f2f0',
      'movet-tan': '#EBD6C5',
      'movet-yellow': '#DAAA00',
      'movet-brown': '#A15643',
      'movet-blue': '#1D4F91',
      'movet-dark-blue': '#2C3C72',
      'movet-gray': '#D1CCBD',
      'movet-magenta': '#D173A6',
      'movet-pink': '#ECBAA8',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      green: colors.green,
      'notification-light': '#eee',
      'notification-dark': 'rgba(255,255,255,0.1)',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
