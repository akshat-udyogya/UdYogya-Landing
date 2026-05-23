'use client'
/**
 * SceneFloor — dark grid plane with animated glow spots.
 *
 * Gives the floating icons a "ground" to live above (like the tile
 * floor in the etail.me reference) without heavy WebGL overhead.
 * The scene fog in HeroCanvas fades the edges so the floor
 * blends seamlessly into the aurora background behind the canvas.
 */
import { useRef, useMemo } from 'react'
import { useFrame }        from '@react-three/fiber'
import * as THREE          from 'three'

const FLOOR_Y = -3.2

// ── Grid canvas texture (created once) ────────────────────────────────────
let _gridTex: THREE.CanvasTexture | null = null
function buildGridTexture(): THREE.CanvasTexture {
  if (_gridTex) return _gridTex
  const size = 512
  const cv   = document.createElement('canvas')
  cv.width   = cv.height = size
  const ctx  = cv.getContext('2d')!

  ctx.clearRect(0, 0, size, size)

  // Major grid lines (every 128 px → 4 cells across one texture tile)
  ctx.strokeStyle = 'rgba(26, 115, 232, 0.22)'
  ctx.lineWidth   = 1
  for (let i = 128; i < size; i += 128) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke()
  }

  // Minor sub-grid (every 32 px)
  ctx.strokeStyle = 'rgba(26, 115, 232, 0.07)'
  ctx.lineWidth   = 0.5
  for (let i = 32; i < size; i += 32) {
    if (i % 128 === 0) continue   // skip where major lines are
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke()
  }

  _gridTex         = new THREE.CanvasTexture(cv)
  _gridTex.wrapS   = _gridTex.wrapT = THREE.RepeatWrapping
  _gridTex.repeat.set(8, 8)
  return _gridTex
}

// ──────────────────────────────────────────────────────────────────────────
export function SceneFloor() {
  const cobaltGlowRef = useRef<THREE.Mesh>(null!)
  const orangeGlowRef = useRef<THREE.Mesh>(null!)

  const gridTex = useMemo(() => {
    if (typeof window === 'undefined') return undefined
    return buildGridTexture()
  }, [])

  // Gently pulse the glow spots
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (cobaltGlowRef.current) {
      ;(cobaltGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * 0.7) * 0.025
    }
    if (orangeGlowRef.current) {
      ;(orangeGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.04 + Math.sin(t * 0.5 + 1.2) * 0.015
    }
  })

  return (
    <group>
      {/* ── Main floor plane ─────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#050A18"
          map={gridTex}
          roughness={0.88}
          metalness={0.12}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── Cobalt spotlight — below phone (centre) ───────────────────── */}
      <mesh
        ref={cobaltGlowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, FLOOR_Y + 0.02, 0]}
      >
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial
          color="#1A73E8"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Orange accent — right side where expert icons cluster ─────── */}
      <mesh
        ref={orangeGlowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[3.2, FLOOR_Y + 0.02, 0]}
      >
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial
          color="#FF6B35"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
