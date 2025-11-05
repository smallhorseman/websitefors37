/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Poppins', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'ui-serif', 'Georgia'],
      },
      colors: {
        primary: {
          50: '#fef9ef',
          100: '#fdf3d8',
          200: '#fae5b0',
          300: '#f6d37f',
          400: '#f1b846',
          500: '#eda21f',
          600: '#dc8715',
          700: '#b46e14',
          800: '#945a15',
          900: '#7a4b17',
        },
        secondary: {
          50: '#fcf9f0',
          100: '#f6efd6',
          200: '#eadcaa',
          300: '#dcc578',
          400: '#d1ae51',
          500: '#c49833',
          600: '#a17a07',
          700: '#806007',
          800: '#66490c',
          900: '#553d10',
        }
      },
      backgroundImage: {
        'film-grain': "url('https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639916/Pngtree_film_grain_overlay_8671079_amgbm1.png')",
        'subtle-paper': "url('/subtle-paper.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
