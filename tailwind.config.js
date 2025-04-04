// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1100px',
      xl: '1280px',
    },
    extend: {
      colors: {
        purpleTrail: {
          500: "#9F7AEA",
        },
      },
    },
  },
  plugins: [],
};