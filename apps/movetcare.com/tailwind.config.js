module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './forms/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      'movet-red': '#E76159',
      'movet-black': '#232127',
      'movet-white': '#f6f2f0',
      'movet-tan': '#EBD6C5',
      'movet-yellow': '#DAA900',
      'movet-brown': '#A15643',
      'movet-dark-brown': '#6c382b',
      'movet-blue': '#1D4F91',
      'movet-dark-blue': '#2C3C72',
      'movet-gray': '#D1CCBD',
      'movet-magenta': '#D173A6',
      'movet-green': '#00A36C',
      'movet-pink': '#ECBAA8',
      'notification-light': '#eee',
      'notification-dark': 'rgba(255,255,255,0.1)',
    },
    extend: {
      fontFamily: {
        abside: 'Abside',
        parkinson: 'Parkinson',
        'abside-smooth': 'Abside Smooth',
        'source-sans-pro': 'Source Sans Pro',
        'source-sans-pro-italic': 'Source Sans Pro Italic',
      },
      fontSize: {
        'slogan-1': ['1.75rem', '2rem'],
        'slogan-2': ['2.75rem', '1'],
        'p-1': ['.75rem', '1.125rem'],
        'p-2': ['1rem', '1.35rem'],
      },
      borderRadius: {
        image: '100% 50% / 50% 100% / 50% 100% / 100%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
