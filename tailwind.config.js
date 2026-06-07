/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#052e16',
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
          600: '#059669',
          500: '#10b981',
        },
        olive: {
          950: '#1a1a0a',
          900: '#2d2d10',
          800: '#3d3d18',
          700: '#4f4f22',
          600: '#666629',
          500: '#7d7d38',
          400: '#a0a050',
          300: '#c8c878',
        },
        brand: {
          emerald: '#1B4332',
          'emerald-light': '#2D6A4F',
          'emerald-pale': '#40916C',
          olive: '#3B3A1A',
          'olive-mid': '#6B6B2A',
          beige: '#F5EFE6',
          'beige-dark': '#EDE0CE',
          cream: '#FAF8F4',
          'cream-warm': '#F7F1E8',
          gold: '#B8975A',
          'gold-light': '#D4AF6A',
          'gold-pale': '#E8D5A3',
          charcoal: '#1C1C1C',
          'charcoal-soft': '#2E2E2E',
          stone: '#8C8270',
          'stone-light': '#B5A98C',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'heading-lg': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-md': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.25' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'body-md': ['1rem', { lineHeight: '1.65', letterSpacing: '0.01em' }],
        'caption': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
        'label': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.12em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'line-grow': 'lineGrow 1.2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        lineGrow: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'card': '0 2px 20px rgba(27, 67, 50, 0.06)',
        'card-hover': '0 8px 40px rgba(27, 67, 50, 0.12)',
        'gold': '0 4px 20px rgba(184, 151, 90, 0.25)',
        'nav': '0 1px 30px rgba(27, 67, 50, 0.08)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
