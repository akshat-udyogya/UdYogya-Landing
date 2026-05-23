'use client'
import { useRef } from 'react'

const ITEMS = [
  { label: 'ACTIVE EXPERTS',   value: '2,847' },
  { label: 'CONSULTATIONS',    value: '1.2M+' },
  { label: 'AVG RESPONSE',     value: '< 90s' },
  { label: 'SATISFACTION',     value: '4.9★' },
  { label: 'VERIFIED DOMAINS', value: '120+' },
  { label: 'GST INVOICES',     value: '380K' },
  { label: 'CITIES COVERED',   value: '540+' },
  { label: 'FREE CHAT',        value: 'ALWAYS' },
]

// Duplicate for seamless scroll
const DOUBLED = [...ITEMS, ...ITEMS]

export function DataTicker() {
  return (
    <div
      style={{
        position:   'relative',
        width:      '100%',
        overflow:   'hidden',
        background: 'rgba(0,255,255,0.04)',
        borderTop:    '1px solid rgba(0,255,255,0.18)',
        borderBottom: '1px solid rgba(0,255,255,0.18)',
        padding:    '10px 0',
      }}
    >
      {/* Fade masks */}
      <div style={{
        position:    'absolute',
        left: 0, top: 0, bottom: 0,
        width:       80,
        background:  'linear-gradient(to right, #050A18, transparent)',
        zIndex:      2,
        pointerEvents: 'none',
      }} />
      <div style={{
        position:    'absolute',
        right: 0, top: 0, bottom: 0,
        width:       80,
        background:  'linear-gradient(to left, #050A18, transparent)',
        zIndex:      2,
        pointerEvents: 'none',
      }} />

      <div style={{
        display:        'flex',
        width:          'max-content',
        animation:      'ticker-scroll 28s linear infinite',
        gap:            0,
      }}>
        {DOUBLED.map((item, i) => (
          <div key={i} style={{
            display:        'flex',
            alignItems:     'center',
            gap:            10,
            padding:        '0 32px',
            borderRight:    '1px solid rgba(0,255,255,0.12)',
            whiteSpace:     'nowrap',
          }}>
            <span style={{
              color:          'rgba(255,255,255,0.38)',
              fontSize:       10,
              letterSpacing:  '0.16em',
              fontFamily:     'var(--font-mono, monospace)',
            }}>
              {item.label}
            </span>
            <span style={{
              color:          '#00FFFF',
              fontSize:       13,
              fontWeight:     700,
              fontFamily:     'var(--font-mono, monospace)',
              letterSpacing:  '0.06em',
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
