/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "icon-bg": "#e7e9e8",
        "icon-detail-dark": "#120b05",
        "icon-detail-brown": "#9e5719",
        "icon-detail-light": "#fbfdfc",
      },
      fontFamily: {
        adamant: ['"Adamant_BG"', "sans-serif"],
      },
    },
  },
  plugins: [animate],
};
