'use client'
/**
 * DigitalTwinCanvas — wraps R3F Canvas with adaptive performance.
 *
 * Optimisations applied here:
 *  • dpr starts at 1, rises to min(devicePixelRatio, 1.5) on hover only
 *  • PerformanceMonitor auto-reduces dpr when FPS drops (covers low-end GPUs)
 *  • performance={{ min: 0.5 }} lets R3F's scheduler halve its budget when idle
 *  • powerPreference:'high-performance' hints the OS to keep the dGPU alive
 *  • R3F natively pauses on visibilitychange (tab hidden) — no extra code needed
 */
import { Suspense, useState, useCallback } from 'react'
import { Canvas }                          from '@react-three/fiber'
import { PerformanceMonitor }              from '@react-three/drei'
import * as THREE                          from 'three'
import { DigitalTwinScene, type ModuleInfo } from './DigitalTwinScene'

interface DigitalTwinCanvasProps {
  onModuleClick?: (info: ModuleInfo) => void
}

export default function DigitalTwinCanvas({ onModuleClick }: DigitalTwinCanvasProps) {
  // Start at 1× — boost to 1.5× only while a module is hovered (#4 frame budget)
  const [dpr, setDpr] = useState(1)

  const handleHoverChange = useCallback((hovered: boolean) => {
    setDpr(hovered
      ? Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)
      : 1)
  }, [])

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [0, 2.4, 10], fov: 52 }}
      gl={{
        alpha:               true,
        antialias:           true,
        toneMapping:         THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.18,
        powerPreference:     'high-performance',
      }}
      // Allow R3F's internal scheduler to use as little as 50 % of budget when idle
      performance={{ min: 0.5 }}
      style={{ background: 'transparent' }}
    >
      {/* Auto-degrades dpr if FPS consistently drops below threshold */}
      <PerformanceMonitor
        onDecline={() => setDpr(d => Math.max(d - 0.25, 0.75))}
        onIncline={() => setDpr(d => Math.min(d + 0.25, 1.5))}
      />

      <fog attach="fog" args={['#050A18', 14, 30]} />

      <Suspense fallback={null}>
        <DigitalTwinScene
          onModuleClick={onModuleClick}
          onHoverChange={handleHoverChange}
        />
      </Suspense>
    </Canvas>
  )
}
