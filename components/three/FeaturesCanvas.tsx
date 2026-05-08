'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PhoneMockup } from '@/components/three/PhoneMockup'

interface FeaturesCanvasProps {
  screenColor: string
}

export default function FeaturesCanvas({ screenColor }: FeaturesCanvasProps) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }} frameloop="demand">
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.2} />
      <Suspense fallback={null}>
        <PhoneMockup screenColor={screenColor} scale={1.5} />
      </Suspense>
    </Canvas>
  )
}
