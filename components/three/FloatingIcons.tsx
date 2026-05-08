'use client'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Color tokens ───────────────────────────────────────────────────────────
const COBALT    = '#494fdf'
const COBALT_LT = '#4f55f1'
const WHITE     = '#ffffff'
const VOID      = '#050505'

// ─── Icon: Gear (Engineering / Technical) ───────────────────────────────────
function GearIcon() {
  return (
    <group>
      {/* Ring — torus is in XY plane by default, faces camera */}
      <mesh>
        <torusGeometry args={[0.3, 0.095, 8, 20]} />
        <meshStandardMaterial
          color={COBALT} metalness={0.6} roughness={0.2}
          emissive={COBALT} emissiveIntensity={0.12}
        />
      </mesh>
      {/* Center disc (rotate cylinder so flat face points toward camera) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.1, 12]} />
        <meshStandardMaterial color={COBALT_LT} metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Center hole */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.15, 8]} />
        <meshStandardMaterial color={VOID} />
      </mesh>
      {/* 8 teeth — radially arranged, wide side points outward (args[0]=radial dim) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const θ = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(θ) * 0.42, Math.sin(θ) * 0.42, 0]}
            rotation={[0, 0, θ]}
          >
            <boxGeometry args={[0.2, 0.11, 0.12]} />
            <meshStandardMaterial
              color={COBALT} metalness={0.6} roughness={0.2}
              emissive={COBALT} emissiveIntensity={0.12}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Icon: Hard Hat (Construction / Engineering) ────────────────────────────
function HardHatIcon() {
  return (
    <group>
      {/* Dome — upper hemisphere of sphere, centered slightly above brim */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.32, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={COBALT} metalness={0.2} roughness={0.5}
          emissive={COBALT} emissiveIntensity={0.08}
        />
      </mesh>
      {/* Brim — flat disc, rotated so face points toward camera */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.5, 0.06, 24]} />
        <meshStandardMaterial color={COBALT_LT} metalness={0.2} roughness={0.5} />
      </mesh>
      {/* Ventilation rib on top */}
      <mesh position={[0, 0.3, 0.2]} rotation={[Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.07, 0.26, 0.04]} />
        <meshStandardMaterial color={WHITE} metalness={0.1} roughness={0.7} />
      </mesh>
    </group>
  )
}

// ─── Icon: Wrench (Mechanical / Plumbing) ───────────────────────────────────
function WrenchIcon() {
  return (
    <group>
      {/* Handle shaft */}
      <mesh>
        <cylinderGeometry args={[0.064, 0.074, 0.74, 10]} />
        <meshStandardMaterial
          color={COBALT} metalness={0.7} roughness={0.15}
          emissive={COBALT} emissiveIntensity={0.1}
        />
      </mesh>
      {/* Left jaw prong */}
      <mesh position={[-0.16, 0.5, 0]}>
        <cylinderGeometry args={[0.064, 0.064, 0.25, 8]} />
        <meshStandardMaterial color={COBALT_LT} metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Right jaw prong */}
      <mesh position={[0.16, 0.5, 0]}>
        <cylinderGeometry args={[0.064, 0.064, 0.25, 8]} />
        <meshStandardMaterial color={COBALT_LT} metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Top cross-bar connecting the jaw */}
      <mesh position={[0, 0.625, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.064, 0.064, 0.44, 8]} />
        <meshStandardMaterial color={COBALT_LT} metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Knob at bottom */}
      <mesh position={[0, -0.44, 0]}>
        <sphereGeometry args={[0.094, 10, 8]} />
        <meshStandardMaterial color={COBALT} metalness={0.7} roughness={0.15} />
      </mesh>
    </group>
  )
}

// ─── Icon: Chat Bubble (Consultation Platform) ──────────────────────────────
const DOT_XS = [-0.19, 0, 0.19]

function ChatBubbleIcon() {
  return (
    <group>
      {/* Bubble body */}
      <mesh>
        <boxGeometry args={[0.68, 0.46, 0.14]} />
        <meshStandardMaterial
          color={COBALT} metalness={0.15} roughness={0.6}
          emissive={COBALT} emissiveIntensity={0.1}
        />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.18, -0.32, 0]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.1, 0.2, 4]} />
        <meshStandardMaterial color={COBALT} metalness={0.15} roughness={0.6} />
      </mesh>
      {/* Typing dots */}
      {DOT_XS.map((x, i) => (
        <mesh key={i} position={[x, 0, 0.09]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color={WHITE} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Icon: Briefcase (Business / Legal / Professional) ──────────────────────
function BriefcaseIcon() {
  return (
    <group>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.66, 0.46, 0.2]} />
        <meshStandardMaterial
          color={COBALT} metalness={0.35} roughness={0.4}
          emissive={COBALT} emissiveIntensity={0.1}
        />
      </mesh>
      {/* Center divider strip */}
      <mesh>
        <boxGeometry args={[0.68, 0.04, 0.22]} />
        <meshStandardMaterial color={COBALT_LT} metalness={0.35} roughness={0.4} />
      </mesh>
      {/* Metal clasp */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.14, 0.1, 0.04]} />
        <meshStandardMaterial color={WHITE} metalness={0.75} roughness={0.1} />
      </mesh>
      {/* Handle — half torus arc */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.038, 8, 14, Math.PI]} />
        <meshStandardMaterial color={WHITE} metalness={0.75} roughness={0.1} />
      </mesh>
    </group>
  )
}

// ─── Icon: Magnifying Glass (Search / Find Experts) ─────────────────────────
function MagnifyingGlassIcon() {
  // Rotation math: CylinderGeometry height is along local +Y.
  // We want the handle to extend lower-right from the lens, i.e. the height
  // axis should point in [0.707, -0.707, 0].
  // Rz(θ) * [0,1,0] = [-sin(θ), cos(θ), 0]
  // → -sin(θ) = 0.707 AND cos(θ) = -0.707  →  θ = -3π/4 (-135°)
  const HANDLE_ROT = -3 * (Math.PI / 4) // = -135°

  // Lens outer edge in the lower-right direction (at angle -45°):
  //   [0.34 * cos(-45°), 0.34 * sin(-45°)] ≈ [0.240, -0.240]
  // Handle center = lens edge + half-length along lower-right direction:
  //   0.46/2 * [0.707, -0.707] ≈ [0.163, -0.163]  →  total ≈ [0.42, -0.42]
  return (
    <group>
      {/* Lens frame ring — torus is already in the XY plane */}
      <mesh>
        <torusGeometry args={[0.27, 0.07, 10, 24]} />
        <meshStandardMaterial color={WHITE} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Lens glass — transparent cobalt disc */}
      <mesh>
        <circleGeometry args={[0.21, 24]} />
        <meshStandardMaterial
          color={COBALT}
          transparent opacity={0.35}
          metalness={0.05} roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Handle — starts at lens edge, extends toward lower-right */}
      <mesh position={[0.42, -0.42, 0]} rotation={[0, 0, HANDLE_ROT]}>
        <cylinderGeometry args={[0.053, 0.063, 0.46, 10]} />
        <meshStandardMaterial color={WHITE} metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  )
}

// ─── Floating wrapper — handles bob + continuous rotation ────────────────────
type FloatingIconProps = {
  children: ReactNode
  position: [number, number, number]
  rotSpeed?: [number, number, number]
  bobPhase?: number
  scale?: number
}

function FloatingIcon({
  children,
  position,
  rotSpeed = [0.2, 0.3, 0],
  bobPhase = 0,
  scale = 1,
}: FloatingIconProps) {
  const ref   = useRef<THREE.Group>(null!)
  const baseY = position[1]

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += rotSpeed[0] * delta
    ref.current.rotation.y += rotSpeed[1] * delta
    ref.current.rotation.z += rotSpeed[2] * delta
    ref.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 0.7 + bobPhase) * 0.2
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function FloatingIcons() {
  return (
    <>
      {/* Gear — upper left */}
      <FloatingIcon position={[-3.5, 2.1, -0.5]} rotSpeed={[0.22, 0.42, 0.05]} bobPhase={0.0} scale={0.82}>
        <GearIcon />
      </FloatingIcon>

      {/* Hard Hat — upper right */}
      <FloatingIcon position={[3.2, 1.9, -0.5]} rotSpeed={[0.16, 0.32, 0.10]} bobPhase={1.2} scale={0.78}>
        <HardHatIcon />
      </FloatingIcon>

      {/* Wrench — mid left */}
      <FloatingIcon position={[-3.7, -1.3, 0.0]} rotSpeed={[0.28, 0.18, 0.00]} bobPhase={2.1} scale={0.78}>
        <WrenchIcon />
      </FloatingIcon>

      {/* Chat Bubble — mid right */}
      <FloatingIcon position={[3.5, -1.6, -0.5]} rotSpeed={[0.12, 0.38, 0.14]} bobPhase={0.8} scale={0.82}>
        <ChatBubbleIcon />
      </FloatingIcon>

      {/* Briefcase — upper center-left */}
      <FloatingIcon position={[-1.8, 2.9, -1.0]} rotSpeed={[0.18, 0.28, 0.00]} bobPhase={1.5} scale={0.68}>
        <BriefcaseIcon />
      </FloatingIcon>

      {/* Magnifying Glass — lower right */}
      <FloatingIcon position={[2.2, -2.9, -0.8]} rotSpeed={[0.32, 0.22, 0.08]} bobPhase={2.5} scale={0.72}>
        <MagnifyingGlassIcon />
      </FloatingIcon>
    </>
  )
}
