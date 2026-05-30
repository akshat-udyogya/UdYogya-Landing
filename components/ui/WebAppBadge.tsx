'use client'
import { WEB_APP_URL } from '@/lib/constants'

interface WebAppBadgeProps {
  size?:    'sm' | 'lg'
  variant?: 'cyan' | 'white' | 'dark'
  label?:   string
}

/**
 * Reusable "Open Web App" badge — matches the landing page cyber aesthetic.
 * variant='cyan'  → dark bg, cyan border/text  (for dark hero sections)
 * variant='white' → white bg, dark text        (for coloured sections)
 * variant='dark'  → dark bg, white border/text (for light sections)
 */
export function WebAppBadge({
  size    = 'lg',
  variant = 'cyan',
  label   = 'Open Web App',
}: WebAppBadgeProps) {
  const pad  = size === 'lg' ? '13px 28px' : '9px 20px'
  const fs   = size === 'lg' ? 13 : 11
  const br   = 4

  const styles: Record<string, React.CSSProperties> = {
    cyan: {
      background:   'rgba(0,255,255,0.08)',
      color:        '#00FFFF',
      border:       '1px solid rgba(0,255,255,0.40)',
      boxShadow:    '0 0 16px rgba(0,255,255,0.12)',
    },
    white: {
      background:   '#fff',
      color:        '#050A18',
      border:       '1px solid rgba(255,255,255,0.9)',
      boxShadow:    '0 0 16px rgba(255,255,255,0.15)',
    },
    dark: {
      background:   'transparent',
      color:        '#0A0A0A',
      border:       '1px solid rgba(10,10,10,0.35)',
    },
  }

  return (
    <a
      href={WEB_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...styles[variant],
        display:        'inline-flex',
        alignItems:     'center',
        gap:            8,
        padding:        pad,
        borderRadius:   br,
        fontFamily:     'var(--font-mono, monospace)',
        fontWeight:     700,
        fontSize:       fs,
        letterSpacing:  '0.10em',
        textDecoration: 'none',
        transition:     'opacity .2s, background .2s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.82')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
    >
      {/* Globe icon */}
      <svg width={size === 'lg' ? 14 : 11} height={size === 'lg' ? 14 : 11}
        viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
      {label}
    </a>
  )
}
