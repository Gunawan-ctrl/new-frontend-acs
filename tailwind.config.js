/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#F8F7FA',
        lightBlue: {
          1: '#E8F8FF',
          2: '#54C1FF'
        },
        lightPurple: {
          1: '#ECF2FF',
          2: '#5D87FF'
        },
        lightGreen: {
          1: '#E6FFFA',
          2: '#13DEB9'
        },
        lightRed: {
          1: '#FDEDE8',
          2: '#FA9377'
        },
        lightOrange: {
          1: '#FEF5E5',
          2: '#FFB332'
        }
      }
    }
  },
  plugins: []
}
