/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4fe',
          100: '#dde6fc',
          200: '#c2d4fa',
          300: '#99bcf7',
          400: '#679cf2',
          500: '#417be9',
          600: '#2c5fcd',
          700: '#234ba4',
          800: '#204085',
          900: '#1e386c',
          950: '#0f1f3e',
        },
        // Semantic Theme Tokens linked to CSS Variables
        theme: {
          primary: 'var(--theme-primary)',
          'primary-hover': 'var(--theme-primary-hover)',
          surface: 'var(--theme-surface)',
          border: 'var(--theme-border)',
          text: 'var(--theme-text)',
        },
        // 4 Vertical Color Systems
        corporate: {
          DEFAULT: '#0f172a',
          accent: '#2563eb',
          light: '#f8fafc',
        },
        agro: {
          DEFAULT: '#16a34a',
          dark: '#14532d',
          hover: '#15803d',
          light: '#f0fdf4',
          badge: '#dcfce7',
        },
        dev: {
          DEFAULT: '#d97706',
          dark: '#78350f',
          hover: '#b45309',
          light: '#fefce8',
          badge: '#fef3c7',
        },
        it: {
          DEFAULT: '#0284c7',
          dark: '#082f49',
          hover: '#0369a1',
          light: '#f0f9ff',
          badge: '#e0f2fe',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
