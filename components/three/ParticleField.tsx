'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 3000
const PROXIMITY = 0.8
const BLUE   = new THREE.Color('#1A73E8')
const ORANGE = new THREE.Color('#FF6B35')

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef  = useRef<THREE.LineSegments>(null!)
  const mouse     = useRef({ x: 0, y: 0 })
  const { size }  = useThree()

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  const colours = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c = Math.random() > 0.3 ? BLUE : ORANGE
      arr[i * 3]     = c.r
      arr[i * 3 + 1] = c.g
      arr[i * 3 + 2] = c.b
    }
    return arr
  }, [])

  useMemo(() => {
    if (typeof window === 'undefined') return
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width  - 0.5) * 2
      mouse.current.y = -(e.clientY / size.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [size])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.03
    pointsRef.current.rotation.x += delta * 0.01
    pointsRef.current.rotation.x +=
      (mouse.current.y * 0.05 - pointsRef.current.rotation.x) * 0.05
    pointsRef.current.rotation.y +=
      (mouse.current.x * 0.05 - pointsRef.current.rotation.y) * 0.05
    if (linesRef.current) {
      linesRef.current.rotation.copy(pointsRef.current.rotation)
    }
  })

  const linePositions = useMemo(() => {
    const pts: number[] = []
    const pos = positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = pos[i*3] - pos[j*3]
        const dy = pos[i*3+1] - pos[j*3+1]
        const dz = pos[i*3+2] - pos[j*3+2]
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (dist < PROXIMITY) {
          pts.push(pos[i*3], pos[i*3+1], pos[i*3+2])
          pts.push(pos[j*3], pos[j*3+1], pos[j*3+2])
        }
      }
    }
    return new Float32Array(pts)
  }, [positions])

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colours, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.85}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1A73E8" transparent opacity={0.08} />
      </lineSegments>
    </group>
  )
}
