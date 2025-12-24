/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'relief-white': '#FAFAF9',
        'certainty-blue': {
          DEFAULT: '#0284C7', // Sky-600
          light: '#E0F2FE',   // Sky-100
          dark: '#0369A1',    // Sky-700
        },
        'validation-gold': '#F59E0B',
        'certainty-dark': '#0F172A', // Slate-900
        'urgent-red': '#E11D48', // Rose-600
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(2, 132, 199, 0.15)',
      }
    },
  },
  plugins: [],
}
