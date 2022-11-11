/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./client/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0px 10px 20px 2px rgba(0, 0, 0, 0.4)',
      },
      dropShadow: {
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.45)',
          '0 45px 65px rgba(0, 0, 0, 0.25)'
        ]
      },
      fontFamily: {
        'sharp': ['Jockey One', 'sans-serif']
      },
    },
    screens: {
      '2xs': '365px',
      'xs': '480px',
      ...defaultTheme.screens
    },
  },
  plugins: [],
}
