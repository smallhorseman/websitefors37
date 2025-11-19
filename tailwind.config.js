/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Dynamic classes that might be purged incorrectly
    'animate-fadeIn',
    'animate-slideUp',
    'animate-zoom',
    'film-grain-bg',
    'vintage-card',
    'retro-shadow',
    'retro-border',
    // Font classes for theme editor
    'font-serif',
    'font-sans',
    'font-cormorant',
    'font-lora',
    'font-crimson',
    'font-libre',
    'font-montserrat',
    'font-raleway',
    'font-nunito',
    'font-worksans',
    'font-cinzel',
    'font-greatvibes',
    'font-bebas',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Poppins', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'ui-serif', 'Georgia'],
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        lora: ['var(--font-lora)', 'Georgia', 'serif'],
        crimson: ['var(--font-crimson)', 'Georgia', 'serif'],
        libre: ['var(--font-libre)', 'Georgia', 'serif'],
        montserrat: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        raleway: ['var(--font-raleway)', 'system-ui', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        worksans: ['var(--font-worksans)', 'system-ui', 'sans-serif'],
        cinzel: ['var(--font-cinzel)', 'Georgia', 'serif'],
        greatvibes: ['var(--font-greatvibes)', 'cursive'],
        bebas: ['var(--font-bebas)', 'impact', 'sans-serif'],
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
          700: '#b46e14', // Main primary color
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
          600: '#a17a07', // Main secondary color
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
