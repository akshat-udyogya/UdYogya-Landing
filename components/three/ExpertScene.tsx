'use client'
/**
 * ExpertScene — Premium hero 3D scene for Udyogya
 *
 * Three brand-relevant cards orbit the central phone mockup in a slow
 * horizontal circle, each facing inward toward the phone as they go around.
 * The white platform + ContactShadows + Environment="studio" give the
 * etail.me-quality product-showcase feel.
 *
 *   Card 1 — Expert Profile   (avatar, 5★, verified badge, CTA button)
 *   Card 2 — Chat Conversation (seeker ↔ expert chat bubbles)
 *   Card 3 — GST Invoice       (line items, orange total, green paid stamp)
 */

import { useRef, type ReactNode } from 'react'
import { useFrame }               from '@react-three/fiber'
import { RoundedBox, Environment, ContactShadows } from '@react-three/drei'
import * as THREE                 from 'three'
import { PhoneMockup }            from '@/components/three/PhoneMockup'

// ─── Orbit wrapper ─────────────────────────────────────────────────────────
// Translates a child in a circle around Y=0, facing inward (toward phone).
// Three cards start 120° apart and travel at the same angular speed.

interface OrbitCardProps {
  initialAngle: number       // radians — starting position on the circle
  radius?:      number       // world-units from centre
  speed?:       number       // radians / second  (full lap ≈ 2π/speed seconds)
  yLevel?:      number       // base Y position of the orbit plane
  scale?:       number
  children:     ReactNode
}

function OrbitCard({
  initialAngle,
  radius   = 3.2,
  speed    = 0.26,
  yLevel   = 0.0,
  scale    = 0.84,
  children,
}: OrbitCardProps) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const θ = initialAngle + t * speed

    if (!ref.current) return

    // Circular XZ position
    ref.current.position.set(
      Math.cos(θ) * radius,
      yLevel + Math.sin(t * 0.65 + initialAngle) * 0.18, // gentle bob
      Math.sin(θ) * radius,
    )

    // Face outward: derivation — after Ry(α) the face direction is [sin α, 0, cos α].
    // We want face pointing away from origin, i.e. [cos θ, 0, sin θ].
    // Solving: sin α = cos θ  AND  cos α = sin θ  →  α = -θ + π/2
    ref.current.rotation.y = -θ + Math.PI / 2

    // Subtle forward tilt so card faces slightly downward toward viewer
    ref.current.rotation.x = 0.10 + Math.sin(t * 0.4 + initialAngle) * 0.03
  })

  return (
    <group ref={ref} scale={scale}>
      {children}
    </group>
  )
}

// ─── Expert Profile Card ───────────────────────────────────────────────────
function ExpertCardContent() {
  return (
    <group>
      {/* White card body */}
      <RoundedBox args={[2.5, 1.55, 0.10]} radius={0.14} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.32} metalness={0.02} />
      </RoundedBox>

      {/* Avatar circle */}
      <mesh position={[-0.84, 0.30, 0.06]}>
        <circleGeometry args={[0.34, 32]} />
        <meshStandardMaterial color="#1A73E8" roughness={0.5} />
      </mesh>
      <mesh position={[-0.84, 0.30, 0.065]}>
        <ringGeometry args={[0.28, 0.34, 32]} />
        <meshStandardMaterial color="#4fa8ff" roughness={0.4} />
      </mesh>

      {/* Name bar */}
      <RoundedBox args={[1.05, 0.13, 0.025]} radius={0.065} smoothness={2}
        position={[0.22, 0.40, 0.06]}>
        <meshStandardMaterial color="#0D1526" roughness={0.9} />
      </RoundedBox>
      {/* Sub-title bar */}
      <RoundedBox args={[0.72, 0.085, 0.02]} radius={0.042} smoothness={2}
        position={[0.08, 0.22, 0.06]}>
        <meshStandardMaterial color="#8B9DC3" roughness={0.9} />
      </RoundedBox>

      {/* 5 gold stars */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[-0.50 + i * 0.24, -0.05, 0.06]}>
          <circleGeometry args={[0.07, 5]} />
          <meshStandardMaterial color="#FFB800" emissive="#FFB800" emissiveIntensity={0.45} />
        </mesh>
      ))}

      {/* Verified green badge */}
      <mesh position={[0.94, 0.40, 0.06]}>
        <circleGeometry args={[0.14, 32]} />
        <meshStandardMaterial color="#00C853" emissive="#00C853" emissiveIntensity={0.30} />
      </mesh>

      {/* CTA button */}
      <RoundedBox args={[1.95, 0.33, 0.045]} radius={0.165} smoothness={4}
        position={[0, -0.54, 0.06]}>
        <meshStandardMaterial color="#1A73E8" roughness={0.28}
          emissive="#1A73E8" emissiveIntensity={0.18} />
      </RoundedBox>
      <RoundedBox args={[0.65, 0.07, 0.02]} radius={0.035} smoothness={2}
        position={[0, -0.54, 0.09]}>
        <meshStandardMaterial color="#ffffff" roughness={0.8} transparent opacity={0.7} />
      </RoundedBox>
    </group>
  )
}

// ─── Chat Conversation Card ────────────────────────────────────────────────
function ChatCardContent() {
  return (
    <group>
      {/* White card */}
      <RoundedBox args={[2.1, 1.75, 0.10]} radius={0.14} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.32} metalness={0.02} />
      </RoundedBox>

      {/* Header strip */}
      <RoundedBox args={[2.1, 0.38, 0.03]} radius={0.08} smoothness={2}
        position={[0, 0.685, 0.055]}>
        <meshStandardMaterial color="#F5F7FF" roughness={0.6} />
      </RoundedBox>
      {/* Header avatar */}
      <mesh position={[-0.76, 0.685, 0.09]}>
        <circleGeometry args={[0.125, 32]} />
        <meshStandardMaterial color="#FF6B35" roughness={0.5} />
      </mesh>
      {/* Online dot */}
      <mesh position={[-0.64, 0.60, 0.10]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#00C853" emissive="#00C853" emissiveIntensity={0.5} />
      </mesh>
      {/* Name line */}
      <RoundedBox args={[0.65, 0.085, 0.02]} radius={0.04} smoothness={2}
        position={[-0.22, 0.71, 0.09]}>
        <meshStandardMaterial color="#0D1526" roughness={0.9} />
      </RoundedBox>

      {/* Received bubble 1 */}
      <RoundedBox args={[1.4, 0.30, 0.065]} radius={0.15} smoothness={4}
        position={[-0.22, 0.29, 0.07]}>
        <meshStandardMaterial color="#EEF0FF" roughness={0.45} />
      </RoundedBox>

      {/* Sent bubble (cobalt) */}
      <RoundedBox args={[1.15, 0.30, 0.065]} radius={0.15} smoothness={4}
        position={[0.28, -0.06, 0.07]}>
        <meshStandardMaterial color="#1A73E8" roughness={0.28}
          emissive="#1A73E8" emissiveIntensity={0.12} />
      </RoundedBox>

      {/* Received bubble 2 */}
      <RoundedBox args={[1.5, 0.30, 0.065]} radius={0.15} smoothness={4}
        position={[-0.17, -0.40, 0.07]}>
        <meshStandardMaterial color="#EEF0FF" roughness={0.45} />
      </RoundedBox>

      {/* Free chat badge */}
      <RoundedBox args={[0.82, 0.22, 0.04]} radius={0.11} smoothness={4}
        position={[-0.44, -0.72, 0.07]}>
        <meshStandardMaterial color="#00C853" roughness={0.35}
          emissive="#00C853" emissiveIntensity={0.20} />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.065, 0.02]} radius={0.03} smoothness={2}
        position={[-0.44, -0.72, 0.10]}>
        <meshStandardMaterial color="#ffffff" roughness={0.8} transparent opacity={0.75} />
      </RoundedBox>
    </group>
  )
}

// ─── GST Invoice Card ──────────────────────────────────────────────────────
function InvoiceCardContent() {
  const lineWidths  = [1.2, 0.8, 1.0, 0.65, 1.1, 0.7]
  const lineOffsets = [0.1, 0.25, 0.08, 0.22, 0.06, 0.20]

  return (
    <group>
      {/* White document body */}
      <RoundedBox args={[1.85, 2.55, 0.09]} radius={0.10} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.32} metalness={0.02} />
      </RoundedBox>

      {/* Dark header band */}
      <RoundedBox args={[1.85, 0.40, 0.025]} radius={0.05} smoothness={2}
        position={[0, 1.06, 0.06]}>
        <meshStandardMaterial color="#050A18" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.65, 0.08, 0.02]} radius={0.04} smoothness={2}
        position={[-0.20, 1.10, 0.09]}>
        <meshStandardMaterial color="#ffffff" roughness={0.8} transparent opacity={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.40, 0.06, 0.02]} radius={0.03} smoothness={2}
        position={[-0.28, 0.97, 0.09]}>
        <meshStandardMaterial color="#4fa8ff" roughness={0.8} transparent opacity={0.8} />
      </RoundedBox>

      {/* Line items */}
      {lineWidths.map((w, i) => (
        <RoundedBox key={i} args={[w, 0.075, 0.018]} radius={0.037} smoothness={2}
          position={[-lineOffsets[i], 0.72 - i * 0.19, 0.055]}>
          <meshStandardMaterial color="#8B9DC3" roughness={0.9} />
        </RoundedBox>
      ))}

      {/* Divider */}
      <RoundedBox args={[1.60, 0.018, 0.015]} radius={0.009} smoothness={2}
        position={[0, -0.44, 0.055]}>
        <meshStandardMaterial color="#E0E4F0" roughness={0.9} />
      </RoundedBox>

      {/* Orange total bar */}
      <RoundedBox args={[1.65, 0.13, 0.03]} radius={0.065} smoothness={2}
        position={[0, -0.58, 0.06]}>
        <meshStandardMaterial color="#FF6B35" roughness={0.35}
          emissive="#FF6B35" emissiveIntensity={0.18} />
      </RoundedBox>

      {/* Green paid stamp */}
      <mesh position={[0.50, -0.88, 0.06]}>
        <circleGeometry args={[0.30, 32]} />
        <meshStandardMaterial color="#00C853" roughness={0.5} transparent opacity={0.18} />
      </mesh>
      <mesh position={[0.50, -0.88, 0.065]}>
        <ringGeometry args={[0.24, 0.30, 32]} />
        <meshStandardMaterial color="#00C853" emissive="#00C853" emissiveIntensity={0.25} />
      </mesh>
      <RoundedBox args={[0.26, 0.06, 0.02]} radius={0.03} smoothness={2}
        position={[0.50, -0.88, 0.09]}>
        <meshStandardMaterial color="#00C853" roughness={0.5}
          emissive="#00C853" emissiveIntensity={0.3} />
      </RoundedBox>
    </group>
  )
}

// ─── White platform / stage ────────────────────────────────────────────────
function Stage() {
  return (
    <group>
      <RoundedBox args={[9.5, 0.16, 6.5]} radius={0.08} smoothness={4}
        position={[0, -2.58, 0]}>
        <meshStandardMaterial color="#f0f0f7" roughness={0.26} metalness={0.05} />
      </RoundedBox>
      <ContactShadows
        position={[0, -2.49, 0]}
        opacity={0.42}
        scale={14}
        blur={2.8}
        far={2.8}
        color="#0a0a22"
      />
    </group>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────
export function ExpertScene() {
  const TWO_PI    = Math.PI * 2
  const THIRD     = TWO_PI / 3   // 120° between each card

  return (
    <>
      {/* HDR studio lighting — biggest single quality improvement */}
      <Environment preset="studio" />

      {/* Brand-colour accent lights */}
      <directionalLight position={[4, 6, 4]}  intensity={0.55} color="#ffffff" />
      <directionalLight position={[-4, 3, 3]} intensity={0.30} color="#4fa8ff" />
      <pointLight        position={[3, -1, 4]} intensity={0.50} color="#FF6B35" />

      {/* Platform + soft contact shadows */}
      <Stage />

      {/* ── Three orbiting cards, 120° apart ────────────────────────── */}
      <OrbitCard initialAngle={0}            radius={3.2} speed={0.26} yLevel={0.0}>
        <ExpertCardContent />
      </OrbitCard>

      <OrbitCard initialAngle={THIRD}        radius={3.2} speed={0.26} yLevel={0.05}>
        <ChatCardContent />
      </OrbitCard>

      <OrbitCard initialAngle={THIRD * 2}    radius={3.2} speed={0.26} yLevel={-0.05}>
        <InvoiceCardContent />
      </OrbitCard>

      {/* Phone — fixed at centre, one intro rotation then settles */}
      <PhoneMockup screenColor="#1A73E8" scale={1.35} autoRotate />
    </>
  )
}
