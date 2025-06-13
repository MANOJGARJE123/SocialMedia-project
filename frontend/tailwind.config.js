/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",       // scan your main HTML file
    "./src/**/*.{js,jsx,ts,tsx}",  // scan all JS/TS/React files inside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
