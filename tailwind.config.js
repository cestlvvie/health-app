/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Include all source files
    './pages/**/*.{js,ts,jsx,tsx}', // Include pages if not using App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
