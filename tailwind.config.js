/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8FAFC',
          dark: '#0F172A',
          indigo: '#6366F1',
          orange: '#F97316'
        }
      }
    },
  },
  plugins: [],
}