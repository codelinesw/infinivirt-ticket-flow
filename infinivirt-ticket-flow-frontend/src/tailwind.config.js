/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#4F46E5',
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
        },
        violet: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
      },
      boxShadow: {
        'primary': '0 10px 25px -5px rgba(79, 70, 229, 0.25), 0 8px 10px -6px rgba(124, 58, 237, 0.2)',
      },
      fontFamily: {
        // La clase será font-poppins
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
