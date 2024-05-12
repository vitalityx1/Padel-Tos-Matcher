/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css,html}",
  ],
    theme: {
      fontFamily: {
        sans: ['Roboto','sans'],
      },
      extend: {
      },
    },
    plugins: [require("tailwindcss-animate"),],
  }
