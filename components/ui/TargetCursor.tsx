'use client'
import { useEffect, useRef, useState } from 'react'

export function TargetCursor() {
  const cursorRef  = useRef<HTMLDivElement>(null!)
  const [hovered, setHovered] = useState(false)
  const pos = useRef({ x: -200, y: -200 })
  const displayed = useRef({ x: -200, y: -200 })
  const rafId = useRef<number>()

  useEffect(() => {
    document.body.classList.add('digital-twin-cursor')
    return () => document.body.classList.remove('digital-twin-cursor')
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.matches('a,button,[data-interactive]')) setHovered(true)
    }
    const onLeave = () => setHovered(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    const animate = () => {
      const factor = 0.18
      displayed.current.x += (pos.current.x - displayed.current.x) * factor
      displayed.current.y += (pos.current.y - displayed.current.y) * factor

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${displayed.current.x}px, ${displayed.current.y}px) translate(-50%, -50%)`
      }
      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  const SIZE     = hovered ? 44 : 28
  const CORNER   = 7
  const THICK    = hovered ? 2 : 1.5
  const COLOR    = '#00FFFF'

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        pointerEvents:  'none',
        zIndex:         9999,
        width:          SIZE,
        height:         SIZE,
        transition:     'width 0.15s ease, height 0.15s ease',
      }}
    >
      {/* Top-left corner */}
      <span style={{
        position:    'absolute',
        top: 0, left: 0,
        width:       CORNER,
        height:      CORNER,
        borderTop:   `${THICK}px solid ${COLOR}`,
        borderLeft:  `${THICK}px solid ${COLOR}`,
      }} />
      {/* Top-right */}
      <span style={{
        position:    'absolute',
        top: 0, right: 0,
        width:       CORNER,
        height:      CORNER,
        borderTop:   `${THICK}px solid ${COLOR}`,
        borderRight: `${THICK}px solid ${COLOR}`,
      }} />
      {/* Bottom-left */}
      <span style={{
        position:    'absolute',
        bottom: 0, left: 0,
        width:       CORNER,
        height:      CORNER,
        borderBottom: `${THICK}px solid ${COLOR}`,
        borderLeft:   `${THICK}px solid ${COLOR}`,
      }} />
      {/* Bottom-right */}
      <span style={{
        position:    'absolute',
        bottom: 0, right: 0,
        width:       CORNER,
        height:      CORNER,
        borderBottom: `${THICK}px solid ${COLOR}`,
        borderRight:  `${THICK}px solid ${COLOR}`,
      }} />
      {/* Centre dot */}
      <span style={{
        position:    'absolute',
        top:         '50%',
        left:        '50%',
        transform:   'translate(-50%, -50%)',
        width:       hovered ? 6 : 3,
        height:      hovered ? 6 : 3,
        borderRadius: '50%',
        background:  COLOR,
        transition:  'all 0.15s ease',
      }} />
    </div>
  )
}
