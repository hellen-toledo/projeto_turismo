/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '.admin-dark'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'goiano-green': '#00a859', 
      },
      borderRadius: {
        'xl': '1rem', 
      }
    },
  },
  plugins: [],
}
