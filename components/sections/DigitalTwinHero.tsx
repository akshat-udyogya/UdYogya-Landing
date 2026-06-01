'use client'
/**
 * DigitalTwinHero — responsive hero section
 *
 * Desktop (md+) : full 3D canvas + custom cursor + expert panel
 * Mobile (<md)  : lightweight 2-D layout — aurora blobs, headline, module
 *                 tap-cards, download CTA. No WebGL loaded at all.
 */

import { useState, useCallback, useEffect } from 'react'
import dynamic   from 'next/dynamic'
import { motion } from 'framer-motion'
import { ExpertPanel } from '@/components/ui/ExpertPanel'
import { DataTicker }  from '@/components/ui/DataTicker'
import { WebAppBadge } from '@/components/ui/WebAppBadge'
import { MODULES }     from '@/components/three/DigitalTwinScene'
import type { ModuleInfo } from '@/components/three/DigitalTwinScene'
import { PLAY_STORE_URL } from '@/lib/constants'

const DigitalTwinCanvas = dynamic(
  () => import('@/components/three/DigitalTwinCanvas'),
  { ssr: false }
)

// ─── Hardware tier detection — skip expensive CSS blurs on low-end devices (#5)
// navigator.hardwareConcurrency ≥ 4 is a reasonable proxy for a capable GPU.
function useIsHighEndDevice(): boolean {
  // Server-side default: assume capable so SSR renders aurora (hydration fixes it)
  if (typeof navigator === 'undefined') return true
  return (navigator.hardwareConcurrency ?? 4) >= 4
}

// ─── Mobile detection ───────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return mobile
}

// ─── Shared aurora background ───────────────────────────────────────────────
function AuroraBackground({ mobile }: { mobile: boolean }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Cobalt blob */}
      <div style={{
        position:'absolute', width: mobile ? 480 : 680, height: mobile ? 480 : 680,
        borderRadius:'50%', background:'#1A73E8',
        filter:`blur(${mobile ? 100 : 130}px)`,
        opacity: mobile ? 0.30 : 0.22,
        top:-160, right:-120,
        animation:'aurora-drift-1 16s ease-in-out infinite alternate',
      }} />
      {/* Orange blob */}
      <div style={{
        position:'absolute', width: mobile ? 380 : 520, height: mobile ? 380 : 520,
        borderRadius:'50%', background:'#FF6B35',
        filter:`blur(${mobile ? 90 : 110}px)`,
        opacity: mobile ? 0.22 : 0.16,
        bottom:-80, left: mobile ? -40 : 60,
        animation:'aurora-drift-2 13s ease-in-out infinite alternate',
      }} />
      {/* Cyan accent */}
      <div style={{
        position:'absolute', width: mobile ? 300 : 460, height: mobile ? 300 : 460,
        borderRadius:'50%', background:'#00FFFF',
        filter:`blur(${mobile ? 100 : 120}px)`,
        opacity: mobile ? 0.10 : 0.07,
        top:'35%', left:'30%',
        animation:'aurora-drift-3 19s ease-in-out infinite alternate',
      }} />
    </div>
  )
}

// ─── Shared nav ─────────────────────────────────────────────────────────────
function NavBar({ mobile }: { mobile: boolean }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.55 }}
      style={{
        position:'relative', zIndex:10,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: mobile ? '1.1rem 1.25rem' : '1.5rem 2rem',
        pointerEvents:'auto',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width: mobile ? 28 : 32, height: mobile ? 28 : 32,
          borderRadius: 8,
          backgroundImage: 'url(/assets/logo.png)',
          backgroundSize: '154%',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily:'var(--font-orbitron, monospace)',
          color:'#fff', fontSize: mobile ? 16 : 18,
          fontWeight:700, letterSpacing:'0.08em',
        }}>
          UDYOGYA
        </span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap: mobile ? 12 : 24 }}>
        {!mobile && ['MODULES','EXPERTS','PRICING'].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} style={{
            fontFamily:'var(--font-mono, monospace)',
            color:'rgba(255,255,255,0.55)', fontSize:11,
            letterSpacing:'0.14em', textDecoration:'none',
            transition:'color .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color='#00FFFF')}
          onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.55)')}
          >{n}</a>
        ))}
        {!mobile && (
          <WebAppBadge size="sm" variant="cyan" label="WEB APP" />
        )}
        <a
          href={PLAY_STORE_URL}
          data-interactive
          style={{
            fontFamily:'var(--font-mono, monospace)',
            color:'#050A18', background:'#00FFFF',
            fontSize: mobile ? 10 : 11, fontWeight:700,
            letterSpacing:'0.12em',
            padding: mobile ? '7px 14px' : '8px 18px',
            borderRadius:3, textDecoration:'none',
          }}
        >
          GET APP
        </a>
      </div>
    </motion.nav>
  )
}

// ─── Mobile module tap-cards ─────────────────────────────────────────────────
function MobileModuleCards({ onTap }: { onTap: (m: ModuleInfo) => void }) {
  return (
    <div
      className="hide-scrollbar"
      style={{
        display:'flex', gap:12,
        padding:'0 1.25rem 0.5rem',
        overflowX:'auto',
        WebkitOverflowScrolling:'touch',
      }}
    >
      {MODULES.map(m => (
        <motion.button
          key={m.id}
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.9 + MODULES.indexOf(m) * 0.12, duration:0.45 }}
          onClick={() => onTap(m)}
          style={{
            flexShrink:0,
            width:158,
            padding:'1rem 1rem 0.9rem',
            background:`linear-gradient(145deg, ${m.accentColor}18 0%, rgba(5,10,24,0.85) 100%)`,
            border:`1px solid ${m.accentColor}44`,
            borderRadius:12,
            textAlign:'left',
            cursor:'pointer',
            position:'relative',
            overflow:'hidden',
          }}
        >
          {/* Top glow strip */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:2,
            background:`linear-gradient(90deg, transparent, ${m.accentColor}, transparent)`,
            opacity:0.7,
          }} />
          {/* Indicator dot */}
          <div style={{
            width:8, height:8, borderRadius:'50%',
            background:m.accentColor,
            boxShadow:`0 0 8px ${m.accentColor}`,
            marginBottom:10,
          }} />
          {/* Expert count */}
          <div style={{
            fontFamily:'var(--font-orbitron, monospace)',
            fontSize:32, fontWeight:900,
            color:m.accentColor, lineHeight:1,
            marginBottom:5,
          }}>
            {m.experts}
          </div>
          {/* Label */}
          <div style={{
            color:'#fff', fontSize:12,
            fontWeight:600, lineHeight:1.3,
            marginBottom:4,
          }}>
            {m.label}
          </div>
          <div style={{
            color:'rgba(255,255,255,0.42)',
            fontSize:10,
            fontFamily:'var(--font-mono, monospace)',
            letterSpacing:'0.10em',
          }}>
            EXPERTS ONLINE
          </div>
          {/* Arrow */}
          <div style={{
            position:'absolute', bottom:10, right:12,
            color:m.accentColor, fontSize:14, opacity:0.7,
          }}>→</div>
        </motion.button>
      ))}
    </div>
  )
}

// ─── Mobile hero layout ──────────────────────────────────────────────────────
function MobileHero({ onModuleClick }: { onModuleClick: (m: ModuleInfo) => void }) {
  return (
    <section style={{
      position:'relative', minHeight:'100vh',
      background:'#050A18', overflow:'hidden',
      display:'flex', flexDirection:'column',
    }}>
      <AuroraBackground mobile />

      {/* Scanlines */}
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,20,40,0.07) 3px, rgba(0,20,40,0.07) 4px)',
      }} />
      {/* Vignette */}
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
        background:'radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(5,10,24,0.65) 100%)',
      }} />

      <div style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', flex:1 }}>
        <NavBar mobile />

        {/* Hero copy */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 1.25rem 1.5rem' }}>
          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.55 }}
            style={{
              fontFamily:'var(--font-mono, monospace)',
              color:'#00FFFF', fontSize:10,
              letterSpacing:'0.20em', textTransform:'uppercase',
              marginBottom:14,
            }}
          >
            ◈ INDUSTRIAL EXPERT NETWORK ◈ ONLINE
          </motion.p>

          <motion.h1
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.7, duration:0.6 }}
            style={{
              fontFamily:'var(--font-orbitron, monospace)',
              fontSize:'clamp(26px, 8vw, 40px)',
              fontWeight:900, color:'#fff',
              lineHeight:1.10, letterSpacing:'-0.01em',
              marginBottom:16,
            }}
          >
            YOUR INDUSTRIAL<br />
            <span style={{ color:'#00FFFF', textShadow:'0 0 20px rgba(0,255,255,0.40)' }}>
              EXPERT ON-DEMAND
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.88, duration:0.5 }}
            style={{
              color:'rgba(255,255,255,0.62)',
              fontSize:14, lineHeight:1.75,
              marginBottom:24, maxWidth:360,
            }}
          >
            Connect with verified engineers across PLC automation, hydraulics,
            robotics, and 120+ industrial domains. Chat free — pay only for
            in-depth consultations.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:1.0 }}
            style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}
          >
            <a
              href={PLAY_STORE_URL}
              style={{
                fontFamily:'var(--font-mono, monospace)',
                background:'#00FFFF', color:'#050A18',
                padding:'13px 24px', borderRadius:4,
                fontWeight:700, fontSize:12,
                letterSpacing:'0.10em', textDecoration:'none',
                boxShadow:'0 0 24px rgba(0,255,255,0.32)',
              }}
            >
              ▶ DOWNLOAD APP
            </a>
            <WebAppBadge size="lg" variant="cyan" label="OPEN WEB APP" />
          </motion.div>

          {/* Tap-card hint */}
          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:1.3 }}
            style={{
              fontFamily:'var(--font-mono, monospace)',
              color:'rgba(0,255,255,0.42)',
              fontSize:10, letterSpacing:'0.13em',
              marginBottom:14,
            }}
          >
            ↓ TAP A MODULE CARD TO VIEW EXPERTS
          </motion.p>
        </div>

        {/* Module cards */}
        <MobileModuleCards onTap={onModuleClick} />

        {/* Divider */}
        <div style={{ height:1, background:'rgba(0,255,255,0.10)', margin:'12px 0 0' }} />
      </div>

      <div style={{ position:'relative', zIndex:10 }}>
        <DataTicker />
      </div>
    </section>
  )
}

// ─── Desktop hero layout ─────────────────────────────────────────────────────
function DesktopHero({ onModuleClick }: { onModuleClick: (m: ModuleInfo) => void }) {
  // Skip CSS aurora blurs on low-end devices — saves GPU compositing layers (#5)
  const highEnd = useIsHighEndDevice()

  return (
    <section
      id="hero"
      style={{
        position:'relative', minHeight:'100vh',
        background:'#050A18', overflow:'hidden',
        display:'flex', flexDirection:'column',
      }}
    >
      {highEnd && <AuroraBackground mobile={false} />}

      {/* Scanlines */}
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:5, pointerEvents:'none',
        background:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,20,40,0.08) 3px, rgba(0,20,40,0.08) 4px)',
      }} />
      {/* Vignette */}
      <div aria-hidden style={{
        position:'absolute', inset:0, zIndex:4, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 40%, rgba(5,10,24,0.72) 100%)',
      }} />

      {/* 3D canvas */}
      <div style={{ position:'absolute', inset:0, zIndex:1 }} aria-hidden>
        <DigitalTwinCanvas onModuleClick={onModuleClick} />
      </div>

      {/* pointerEvents:'none' makes transparent areas click-through to canvas.
           Child buttons/links still work — CSS pointer-events doesn't block descendants
           that have their own default pointer-events:auto. */}
      <div style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', flex:1, pointerEvents:'none' }}>
        <NavBar mobile={false} />

        {/* Copy — inherits pointer-events:none from parent so the transparent
             area passes clicks through to the 3D canvas.
             Only the CTA buttons restore pointer-events below. */}
        <div style={{
          flex:1, display:'flex', flexDirection:'column',
          justifyContent:'center', padding:'0 2rem 4rem', maxWidth:620,
        }}>
          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.7 }}
            style={{
              fontFamily:'var(--font-mono, monospace)',
              color:'#00FFFF', fontSize:11,
              letterSpacing:'0.22em', textTransform:'uppercase',
              marginBottom:16,
            }}
          >
            ◈ INDUSTRIAL EXPERT NETWORK ◈ ONLINE
          </motion.p>

          <motion.h1
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.85, duration:0.65 }}
            style={{
              fontFamily:'var(--font-orbitron, monospace)',
              fontSize:'clamp(28px, 5vw, 56px)',
              fontWeight:900, color:'#fff',
              lineHeight:1.08, letterSpacing:'-0.01em',
              marginBottom:24,
            }}
          >
            YOUR INDUSTRIAL<br />
            <span style={{ color:'#00FFFF', textShadow:'0 0 24px rgba(0,255,255,0.45)' }}>
              EXPERT ON-DEMAND
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:1.05, duration:0.55 }}
            style={{
              color:'rgba(255,255,255,0.62)',
              fontSize:16, lineHeight:1.72,
              marginBottom:36, maxWidth:440,
            }}
          >
            Connect with verified engineers across PLC automation, power
            generation, hydraulics, and 120+ industrial domains. Chat free —
            pay only for in-depth consultations.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:1.25 }}
            style={{ display:'flex', gap:14, flexWrap:'wrap', pointerEvents:'auto' }}
          >
            <a
              href={PLAY_STORE_URL}
              data-interactive
              style={{
                fontFamily:'var(--font-mono, monospace)',
                background:'#00FFFF', color:'#050A18',
                padding:'13px 28px', borderRadius:4,
                fontWeight:700, fontSize:13, letterSpacing:'0.10em',
                textDecoration:'none',
                boxShadow:'0 0 24px rgba(0,255,255,0.3)',
              }}
            >
              ▶ DOWNLOAD APP
            </a>
            <WebAppBadge size="lg" variant="cyan" label="OPEN WEB APP" />
            <button
              data-interactive
              onClick={() => onModuleClick(MODULES[0])}
              style={{
                fontFamily:'var(--font-mono, monospace)',
                background:'transparent', color:'rgba(255,255,255,0.5)',
                border:'1px solid rgba(255,255,255,0.2)',
                padding:'13px 24px', borderRadius:4,
                fontWeight:600, fontSize:13,
                letterSpacing:'0.10em', cursor:'pointer',
              }}
            >
              BROWSE MODULES
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:2.0 }}
            style={{
              fontFamily:'var(--font-mono, monospace)',
              color:'rgba(0,255,255,0.42)',
              fontSize:10, letterSpacing:'0.14em', marginTop:20,
            }}
          >
            ← CLICK ANY 3D MODULE TO VIEW EXPERTS
          </motion.p>
        </div>
      </div>

      <div style={{ position:'relative', zIndex:10, pointerEvents:'auto' }}>
        <DataTicker />
      </div>
    </section>
  )
}

// ─── Root component ──────────────────────────────────────────────────────────
export default function DigitalTwinHero() {
  const isMobile    = useIsMobile()
  const [panel, setPanel] = useState<ModuleInfo | null>(null)
  const openPanel   = useCallback((info: ModuleInfo) => setPanel(info), [])

  return (
    <>

      {isMobile
        ? <MobileHero    onModuleClick={openPanel} />
        : <DesktopHero   onModuleClick={openPanel} />
      }

      {/* Glassmorphism expert panel — works on both */}
      <ExpertPanel module={panel} onClose={() => setPanel(null)} />
    </>
  )
}
