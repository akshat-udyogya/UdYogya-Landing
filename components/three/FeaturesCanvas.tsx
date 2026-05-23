'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PhoneMockup } from '@/components/three/PhoneMockup'

interface FeaturesCanvasProps {
  screenColor: string
  screenIndex: number
}

export default function FeaturesCanvas({ screenColor, screenIndex }: FeaturesCanvasProps) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }} frameloop="demand" gl={{ alpha: false }}>
      {/* Deep navy background so phone is clearly visible */}
      <color attach="background" args={['#080e1c']} />

      {/* Ambient fill */}
      <ambientLight intensity={1.6} />
      {/* Key light — top-right front */}
      <pointLight position={[3, 4, 4]}   intensity={3.5} color="#ffffff" />
      {/* Fill light — left */}
      <pointLight position={[-4, 1, 3]}  intensity={1.4} color="#c8d8ff" />
      {/* Rim light — bottom back, creates edge glow on body */}
      <pointLight position={[0, -3, -2]} intensity={2}   color="#6699ff" />
      {/* Top accent */}
      <pointLight position={[0, 5, 2]}   intensity={1}   color="#e0eaff" />

      <Suspense fallback={null}>
        <PhoneMockup screenColor={screenColor} screenIndex={screenIndex} scale={1.5} />
      </Suspense>
    </Canvas>
  )
}
