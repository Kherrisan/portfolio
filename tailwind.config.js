const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  safelist: [{
    pattern: /(bg|text|border)-(grey|brown|orange|yellow|green|blue|purple|pink|red)-(.+)/
  }],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          50: '#fdfdfd',
          100: '#fcfcfc',
          200: '#fafafa',
          300: '#f8f9fa',
          400: '#f6f6f6',
          500: '#f2f2f2',
          600: '#f1f3f5',
          700: '#e9ecef',
          800: '#dee2e6',
          900: '#dde1e3',
        },
        dark: {
          50: '#4a4a4a',
          100: '#3c3c3c',
          200: '#323232',
          300: '#2d2d2d',
          400: '#222222',
          500: '#1f1f1f',
          600: '#1c1c1e',
          700: '#1b1b1b',
          800: '#181818',
          900: '#0f0f0f',
        },
        gray: colors.neutral,
        primary: colors.amber
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h2: {
              'margin-top': '0',
            }
          }
        },
      }),
      fontSize: {
        '0': '0px'
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        // serif: ['"Source Serif 4"', ...defaultTheme.fontFamily.serif],
        // mono: ['"Source Code Pro"', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
