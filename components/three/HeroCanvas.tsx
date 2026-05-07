'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ParticleField } from '@/components/three/ParticleField'
import { PhoneMockup } from '@/components/three/PhoneMockup'

/**
 * Self-contained R3F canvas for the Hero section.
 * Must be dynamically imported (ssr: false) — Three.js requires a browser.
 */
export default function HeroCanvas() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <ParticleField />
        <PhoneMockup
          screenSrc="/assets/screenshots/chat.png"
          scale={1.3}
          autoRotate
        />
      </Suspense>
    </Canvas>
  )
}
