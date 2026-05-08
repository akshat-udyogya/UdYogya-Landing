'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ParticleField } from '@/components/three/ParticleField'
import { PhoneMockup } from '@/components/three/PhoneMockup'
import { FloatingIcons } from '@/components/three/FloatingIcons'

/**
 * Self-contained R3F canvas for the Hero section.
 * Must be dynamically imported (ssr: false) — Three.js requires a browser.
 */
export default function HeroCanvas() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 60 }}>
      {/* General illumination */}
      <ambientLight intensity={0.35} />
      {/* Key light — warm white from upper right */}
      <pointLight position={[5, 5, 5]} intensity={0.9} color="#ffffff" />
      {/* Fill light — cobalt from lower left, brings out the icon colour */}
      <pointLight position={[-4, -3, 3]} intensity={0.6} color="#494fdf" />

      <Suspense fallback={null}>
        {/* Atmosphere — cobalt/white particle cloud */}
        <ParticleField />
        {/* Udyogya-specific floating 3D profession icons */}
        <FloatingIcons />
        {/* Phone mockup — Revolut cobalt screen, single intro rotation */}
        <PhoneMockup screenColor="#494fdf" scale={1.3} autoRotate />
      </Suspense>
    </Canvas>
  )
}
