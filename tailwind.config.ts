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
        // Revolut brand
        primary:          '#494fdf',
        'primary-bright': '#4f55f1',
        'primary-deep':   '#3a40c4',
        // Canvas system
        background:       '#000000',   // canvas-dark: true black
        surface:          '#16181a',   // surface-elevated: dark card surfaces
        'surface-deep':   '#0a0a0a',   // one step darker inset
        'surface-soft':   '#f4f4f4',   // white-band inset surfaces
        // Text
        ink:              '#191c1f',
        muted:            '#8d969e',   // stone: metadata & secondary text
        'on-dark':        '#ffffff',
        'on-dark-mute':   'rgba(255,255,255,0.72)',
        // Hairlines
        'hairline-dark':  'rgba(255,255,255,0.12)',
        'hairline-light': '#e2e2e7',
        // Accent palette (inside product illustrations only)
        'accent-teal':    '#00a87e',
        'accent-pink':    '#e61e49',
        'accent-blue':    '#007bc2',
        'accent-green':   '#428619',
        'accent-orange':  '#ec7e00',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-display)', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        'display-xxl': '-0.02em',   // ~-2.72px at 136px
        'display-xl':  '-0.01em',   // ~-0.8px at 80px
        'display-lg':  '-0.01em',   // ~-0.48px at 48px
        'display-md':  '-0.01em',
        'heading-lg':  '-0.01em',
        'body-ui':      '0.015em',  // 0.24px positive tracking on UI labels
      },
      borderRadius: {
        'rev-sm':  '8px',
        'rev-md':  '12px',
        'rev-lg':  '20px',
        'rev-xl':  '28px',
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
          '0%, 100%': { boxShadow: '0 0 30px 10px rgba(73,79,223,0.3)' },
          '50%':      { boxShadow: '0 0 60px 25px rgba(73,79,223,0.6)' },
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
