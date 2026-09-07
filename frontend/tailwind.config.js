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
        primary: {
          50: '#eef8f2',
          100: '#d5efe0',
          200: '#ade0c4',
          300: '#78c9a0',
          400: '#45ad7a',
          500: '#007a3d',
          600: '#006834',
          700: '#005c2e',
          800: '#064a27',
          900: '#063d22',
          950: '#022313',
        },
        gold: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc170',
          400: '#ff9d37',
          500: '#e85d04',
          600: '#d14f00',
          700: '#a93d02',
          800: '#883208',
          900: '#702b0b',
        },
        luxury: {
          cream: '#f7f8f7',
          ivory: '#ffffff',
          charcoal: '#171717',
          slate: '#262626',
          muted: '#6b7280',
          line: '#e5e7eb',
        },
        border: '#e5e7eb',
        mart: {
          DEFAULT: '#007a3d',
          green: '#007a3d',
          greendark: '#005c2e',
          'green-dark': '#005c2e',
          orange: '#e85d04',
          accent: '#ffc107',
          soft: '#f4f7f5',
          ink: '#171717',
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
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 2px 8px rgba(23, 23, 23, 0.04), 0 8px 24px rgba(23, 23, 23, 0.06)',
        'premium-lg': '0 4px 16px rgba(23, 23, 23, 0.06), 0 16px 48px rgba(23, 23, 23, 0.1)',
        'premium-xl': '0 8px 32px rgba(23, 23, 23, 0.08), 0 24px 64px rgba(23, 23, 23, 0.12)',
        'inner-soft': 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'gold-glow': '0 0 24px rgba(232, 93, 4, 0.25)',
        glow: '0 0 20px rgba(255, 255, 255, 0.06)',
        'glow-lg': '0 0 32px rgba(255, 255, 255, 0.1), 0 8px 40px rgba(0, 0, 0, 0.4)',
        'glow-card': '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.25)',
        cinematic: '0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #005c2e 0%, #007a3d 45%, #0d2818 100%)',
        'gradient-mart': 'linear-gradient(135deg, #005c2e 0%, #007a3d 45%, #0d2818 100%)',
        'gradient-gold': 'linear-gradient(135deg, #ff9d37 0%, #e85d04 50%, #d14f00 100%)',
        'gradient-dark': 'linear-gradient(180deg, #171717 0%, #262626 50%, #171717 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #ffffff 0%, #f4f7f5 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f7f8f7 100%)',
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
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
        luxury: '0.2em',
        wide: '0.1em',
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
};
