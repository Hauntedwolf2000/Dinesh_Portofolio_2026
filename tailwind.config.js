/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        cyber: {
          cyan:    '#00f5ff',
          violet:  '#7c3aed',
          fuchsia: '#ec4899',
          lime:    '#84cc16',
          amber:   '#f59e0b',
        },
        dark: {
          bg:      '#050508',
          surface: '#0d0d14',
          card:    '#12121e',
          border:  '#1e1e30',
          muted:   '#2a2a40',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient':   'radial-gradient(at 27% 37%, hsla(215,98%,61%,1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(275,98%,72%,1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354,98%,61%,1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256,96%,67%,1) 0px, transparent 50%)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'slide-up':    'slideUp 0.5s ease-out',
        'fade-in':     'fadeIn 0.6s ease-out',
        'spin-slow':   'spin 8s linear infinite',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'gradient':    'gradientShift 6s ease infinite',
        'wave':        'wave 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px #7c3aed, 0 0 10px #7c3aed, 0 0 20px #7c3aed' },
          '100%': { boxShadow: '0 0 10px #ec4899, 0 0 30px #ec4899, 0 0 60px #ec4899' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(20deg)' },
          '75%':      { transform: 'rotate(-15deg)' },
        },
      },
      boxShadow: {
        'glow-sm':      '0 0 10px rgba(124, 58, 237, 0.3)',
        'glow-md':      '0 0 20px rgba(124, 58, 237, 0.4)',
        'glow-lg':      '0 0 40px rgba(124, 58, 237, 0.5)',
        'glow-cyan':    '0 0 20px rgba(0, 245, 255, 0.4)',
        'glow-fuchsia': '0 0 20px rgba(236, 72, 153, 0.4)',
        'card-dark':    '0 8px 32px rgba(0, 0, 0, 0.6)',
        'card-light':   '0 8px 32px rgba(124, 58, 237, 0.15)',
        'inner-glow':   'inset 0 0 30px rgba(124, 58, 237, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
