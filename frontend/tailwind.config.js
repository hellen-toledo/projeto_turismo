/** @type {import('tailwindcss').Config} */
export default {
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