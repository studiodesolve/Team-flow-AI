/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          black: '#1d1d1f',
          dark: '#000000',
          gray: '#f5f5f7',
          grayDark: '#86868b',
          blue: '#0066cc',
          blueHover: '#0071e3',
          border: '#d2d2d7',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      },
      letterSpacing: {
        tightest: '-.04em',
        tighter: '-.02em',
        tight: '-.01em',
        normal: '0',
        wide: '.01em',
        wider: '.02em',
        widest: '.04em',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
