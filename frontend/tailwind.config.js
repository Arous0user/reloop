/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        'base-text': '#1F2937',
        'light-gray': '#F3F4F6',
        'silver': '#C0C0C0',
        'navy-blue': '#F8F3EA',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}