/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f6fc',
          100: '#efe9f8',
          200: '#ddd2f0',
          300: '#c4b0e4',
          400: '#a688d4',
          500: '#8b64c4',
          600: '#7349ad',
          700: '#5f3d91',
          800: '#4f3477',
          900: '#422d62',
          950: '#2a1a42',
        },
        gold: {
          50: '#fbf8f1',
          100: '#f5eed9',
          200: '#ead9ad',
          300: '#dcc07a',
          400: '#d4af5a',
          500: '#c9a227',
          600: '#a8841f',
          700: '#86681a',
          800: '#6e551c',
          900: '#5c471c',
        },
        luxury: {
          cream: '#faf8f5',
          ivory: '#f5f2ec',
          charcoal: '#1a1816',
          slate: '#2d2a26',
          muted: '#6b6560',
          line: '#e8e4de',
        },
        border: '#e8e4de',
        mart: {
          green: '#007a3d',
          'green-dark': '#005c2e',
          orange: '#e85d04',
          accent: '#ffc107',
        },
        mono: {
          black: '#0a0a0a',
          surface: '#121212',
          elevated: '#1a1a1a',
          muted: '#a3a3a3',
          line: '#262626',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'premium': '0 2px 8px rgba(26, 24, 22, 0.04), 0 8px 24px rgba(26, 24, 22, 0.06)',
        'premium-lg': '0 4px 16px rgba(26, 24, 22, 0.06), 0 16px 48px rgba(26, 24, 22, 0.1)',
        'premium-xl': '0 8px 32px rgba(26, 24, 22, 0.08), 0 24px 64px rgba(26, 24, 22, 0.12)',
        'inner-soft': 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'glow': '0 0 32px rgba(115, 73, 173, 0.2)',
        'gold-glow': '0 0 24px rgba(201, 162, 39, 0.25)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.06)',
        'glow-lg': '0 0 32px rgba(255, 255, 255, 0.1), 0 8px 40px rgba(0, 0, 0, 0.4)',
        'glow-card': '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.25)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #2a1a42 0%, #4f3477 40%, #1a1816 100%)',
        'gradient-mart': 'linear-gradient(135deg, #005c2e 0%, #007a3d 45%, #0d2818 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4af5a 0%, #c9a227 50%, #a8841f 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1a1816 0%, #2d2a26 50%, #1a1816 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #faf8f5 0%, #f5f2ec 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #faf8f5 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      letterSpacing: {
        'luxury': '0.2em',
        'wide': '0.1em',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /^(bg|text|border|ring-offset|from|to|via)-luxury-(cream|ivory|charcoal|slate|muted|line)(\/\d+)?$/,
    },
    'ring-primary-500/60',
    'tracking-luxury',
  ],
}
