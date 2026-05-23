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
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }} frameloop="demand">
      {/* Ambient fill — keep phone body visible */}
      <ambientLight intensity={1.4} />
      {/* Key light — top-right front */}
      <pointLight position={[3, 4, 4]}  intensity={3}   color="#ffffff" />
      {/* Fill light — left side */}
      <pointLight position={[-4, 1, 3]} intensity={1.2} color="#c8d8ff" />
      {/* Rim light — bottom back, creates edge highlight on phone body */}
      <pointLight position={[0, -3, -2]} intensity={1.5} color="#ffffff" />
      {/* Top accent */}
      <pointLight position={[0,  5, 2]}  intensity={0.8} color="#e0eaff" />
      <Suspense fallback={null}>
        <PhoneMockup screenColor={screenColor} screenIndex={screenIndex} scale={1.5} />
      </Suspense>
    </Canvas>
  )
}
