/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vyuha: {
          navy: '#0a192f',
          dark: '#020c1b',
          light: '#ccd6f6',
        }
      }
    },
  },
  plugins: [],
}
