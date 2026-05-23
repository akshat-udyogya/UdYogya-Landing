'use client'
import { Suspense }      from 'react'
import { Canvas }        from '@react-three/fiber'
import { ExpertScene }   from '@/components/three/ExpertScene'

/**
 * Self-contained R3F canvas for the Hero section.
 *
 * The canvas background is transparent so the CSS aurora gradient
 * in Hero.tsx shows through the dark areas around the white platform.
 * The platform + cards + phone sit on top of it like a product
 * photography shoot on a white stage.
 *
 * Must be dynamically imported (ssr: false).
 */
export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.8, 9], fov: 56 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      {/* Soft ambient base so nothing is pitch-black */}
      <ambientLight intensity={0.25} />

      {/* Atmospheric fog — fades the platform edges into the aurora */}
      <fog attach="fog" args={['#050A18', 11, 22]} />

      <Suspense fallback={null}>
        <ExpertScene />
      </Suspense>
    </Canvas>
  )
}
