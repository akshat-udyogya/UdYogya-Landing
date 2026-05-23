'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { ModuleInfo } from '@/components/three/DigitalTwinScene'

interface ExpertPanelProps {
  module: ModuleInfo | null
  onClose: () => void
}

export function ExpertPanel({ module, onClose }: ExpertPanelProps) {
  return (
    <AnimatePresence>
      {module && (
        <motion.aside
          key={module.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 38 }}
          style={{
            position:        'fixed',
            top:             0,
            right:           0,
            bottom:          0,
            width:           'min(420px, 92vw)',
            background:      'rgba(5, 10, 24, 0.78)',
            backdropFilter:  'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft:      `1.5px solid ${module.accentColor}44`,
            zIndex:          50,
            display:         'flex',
            flexDirection:   'column',
            padding:         '2rem 1.75rem',
            fontFamily:      'var(--font-mono, monospace)',
            overflowY:       'auto',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close expert panel"
            style={{
              alignSelf:       'flex-end',
              background:      'transparent',
              border:          `1px solid ${module.accentColor}66`,
              color:           module.accentColor,
              width:           36,
              height:          36,
              borderRadius:    4,
              cursor:          'pointer',
              fontSize:        18,
              lineHeight:      1,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              marginBottom:    '1.5rem',
            }}
          >
            ×
          </button>

          {/* Module label */}
          <p style={{ color: module.accentColor, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
            MODULE ACTIVE
          </p>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
            {module.label}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            {module.description}
          </p>

          {/* Expert count badge */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            gap:            12,
            padding:        '14px 18px',
            background:     `${module.accentColor}11`,
            border:         `1px solid ${module.accentColor}33`,
            borderRadius:   8,
            marginBottom:   28,
          }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: module.accentColor }}>
              {module.experts}
            </span>
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Verified Experts</p>
              <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: 12 }}>Available now · Chat free</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `${module.accentColor}22`, marginBottom: 24 }} />

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
            {[
              { label: 'Avg Response', value: '< 2 min' },
              { label: 'Satisfaction', value: '4.9 / 5.0' },
              { label: 'Consultations', value: '10,000+' },
              { label: 'GST Invoice', value: 'Auto-gen' },
            ].map(stat => (
              <div key={stat.label} style={{
                padding:        '12px 14px',
                background:     'rgba(255,255,255,0.04)',
                border:         '1px solid rgba(255,255,255,0.08)',
                borderRadius:   6,
              }}>
                <p style={{ color: module.accentColor, fontSize: 16, fontWeight: 700 }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://play.google.com/store/apps/details?id=com.udyogya"
            target="_blank"
            rel="noreferrer"
            style={{
              display:         'block',
              textAlign:       'center',
              padding:         '14px 0',
              background:      module.accentColor,
              color:           '#050A18',
              fontWeight:      700,
              fontSize:        14,
              letterSpacing:   '0.06em',
              borderRadius:    8,
              textDecoration:  'none',
              marginTop:       'auto',
            }}
          >
            CONNECT WITH EXPERT →
          </a>

          {/* Scan overlay on panel */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,255,0.014) 3px, rgba(0,255,255,0.014) 4px)',
            pointerEvents: 'none',
            borderRadius: 0,
          }} />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
