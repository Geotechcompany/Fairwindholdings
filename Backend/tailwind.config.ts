/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-shadow': 'pulse-shadow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Increased duration to 4s
      },
      keyframes: {
        'pulse-shadow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0px rgba(34, 197, 94, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)', // Reduced shadow size
          },
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
