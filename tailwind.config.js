/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'icon-bg': '#e7e9e8',
        'icon-detail-dark': '#120b05',
        'icon-detail-brown': '#9e5719',
        'icon-detail-light': '#fbfdfc',  
      },
      fontFamily: {
        adamant: ['"Adamant_BG"', 'sans-serif'],
      },
      keyframes: {
        card: {
          '0%':   { opacity: '0', transform: 'translateY(12px) scale(.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        card: 'card 600ms cubic-bezier(.22,.61,.36,1) forwards',
      },
    },
  },
  plugins: [animate],
}

