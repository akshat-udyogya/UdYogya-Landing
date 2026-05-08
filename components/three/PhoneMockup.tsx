'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface PhoneMockupProps {
  screenColor?: string  // brand color for this feature's screen
  scale?: number
  autoRotate?: boolean
  glowHalo?: boolean
}

function createScreenTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 400
  const ctx = canvas.getContext('2d')!

  // Gradient background: feature color → deep dark
  const bg = ctx.createLinearGradient(0, 0, 0, 400)
  bg.addColorStop(0, color)
  bg.addColorStop(1, '#000000')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 200, 400)

  // Status bar
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.fillRect(0, 0, 200, 24)

  // Header card
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  fillRoundRect(ctx, 12, 36, 176, 52, 8)

  // Content rows
  ctx.fillStyle = 'rgba(255,255,255,0.10)'
  fillRoundRect(ctx, 12, 104, 176, 36, 6)
  fillRoundRect(ctx, 12, 150, 176, 36, 6)

  // Two-col cards
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  fillRoundRect(ctx, 12, 202, 82, 72, 8)
  fillRoundRect(ctx, 106, 202, 82, 72, 8)

  // Bottom nav
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.fillRect(0, 356, 200, 44)

  // Nav dots
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ;[30, 70, 100, 130, 170].forEach(x => {
    ctx.beginPath()
    ctx.arc(x, 378, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}

export function PhoneMockup({
  screenColor = '#1A73E8',
  scale = 1,
  autoRotate = false,
  glowHalo = false,
}: PhoneMockupProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const rotated  = useRef(false)

  const texture = useMemo(() => createScreenTexture(screenColor), [screenColor])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (autoRotate && !rotated.current) {
      groupRef.current.rotation.y += delta * 2
      if (groupRef.current.rotation.y >= Math.PI * 2) {
        groupRef.current.rotation.y = 0
        rotated.current = true
      }
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} scale={scale}>
        {/* Phone body */}
        <RoundedBox args={[1.2, 2.4, 0.12]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} />
        </RoundedBox>

        {/* Screen */}
        <RoundedBox args={[1.0, 2.0, 0.01]} radius={0.06} smoothness={4} position={[0, 0, 0.065]}>
          <meshStandardMaterial map={texture} />
        </RoundedBox>

        {/* Home bar */}
        <RoundedBox args={[0.28, 0.04, 0.01]} radius={0.02} smoothness={4} position={[0, -1.05, 0.07]}>
          <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
        </RoundedBox>

        {/* Glow halo */}
        {glowHalo && (
          <mesh position={[0, 0, -0.2]}>
            <circleGeometry args={[1.4, 64]} />
            <meshBasicMaterial color="#494fdf" transparent opacity={0.14} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </Float>
  )
}
