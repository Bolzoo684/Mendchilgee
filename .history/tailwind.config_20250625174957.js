/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          lime: '#d9f99d',
          amber: '#fde68a',
          sky: '#bae6fd',
          rose: '#fbcfe8',
          violet: '#ddd6fe',
          cyan: '#a7f3d0',
          emerald: '#6ee7b7',
          blue: '#93c5fd',
          orange: '#fdba74',
        },
      },
      fontFamily: {
        display: ['Poppins', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        pastel: '0 4px 24px 0 rgba(186,230,253,0.15)',
        pastelCard: '0 2px 16px 0 rgba(253,230,138,0.12)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
};
