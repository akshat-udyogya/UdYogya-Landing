import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:      '#1A73E8',
        primaryDark:  '#0D47A1',
        secondary:    '#FF6B35',
        background:   '#050A18',
        surface:      '#0D1526',
        surfaceLight: '#F5F7FA',
        muted:        '#8B9DC3',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
      },
      animation: {
        'marquee-left':  'marqueeLeft 35s linear infinite',
        'marquee-right': 'marqueeRight 35s linear infinite',
        'pulse-halo':    'pulseHalo 2.5s ease-in-out infinite',
        shimmer:         'shimmer 2s linear infinite',
      },
      keyframes: {
        marqueeLeft: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseHalo: {
          '0%, 100%': { boxShadow: '0 0 30px 10px rgba(26,115,232,0.3)' },
          '50%':      { boxShadow: '0 0 60px 25px rgba(26,115,232,0.6)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}

export default config
