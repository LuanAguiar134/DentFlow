/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'burgundy-dark': '#2a0306',
        'burgundy': '#56070c',
        'burgundy-light': '#7a0f15',
        'rose-glass': '#e2a8a8',
        'pearl': '#f5f0ee',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}