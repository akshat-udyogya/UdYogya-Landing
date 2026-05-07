'use client'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface PhoneMockupProps {
  screenSrc?: string
  scale?: number
  autoRotate?: boolean
  glowHalo?: boolean
}

export function PhoneMockup({
  screenSrc = '/assets/screenshots/placeholder.png',
  scale = 1,
  autoRotate = false,
  glowHalo = false,
}: PhoneMockupProps) {
  const groupRef  = useRef<THREE.Group>(null!)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const rotated   = useRef(false)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(screenSrc, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      setTexture(t)
    })
  }, [screenSrc])

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
          <meshStandardMaterial
            color={texture ? '#ffffff' : '#1A73E8'}
            map={texture ?? undefined}
            emissive={texture ? '#000000' : '#0D47A1'}
            emissiveIntensity={texture ? 0 : 0.3}
          />
        </RoundedBox>

        {/* Home bar */}
        <RoundedBox args={[0.28, 0.04, 0.01]} radius={0.02} smoothness={4} position={[0, -1.05, 0.07]}>
          <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
        </RoundedBox>

        {/* Glow halo (CTA section only) */}
        {glowHalo && (
          <mesh position={[0, 0, -0.2]}>
            <circleGeometry args={[1.4, 64] as [number, number]} />
            <meshBasicMaterial color="#1A73E8" transparent opacity={0.12} side={THREE.BackSide} />
          </mesh>
        )}
      </group>
    </Float>
  )
}
