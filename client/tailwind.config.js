/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        aws: {
          orange: '#FF9900',
          'dark-blue': '#232F3E',
          'light-blue': '#1A73E8',
          gray: '#545B64',
          'light-gray': '#D5DBDB',
          bg: '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
};