'use client'
/**
 * ParticleField — "Living Expert Network"
 *
 * Scene layers (back to front):
 *   1. Star field  — 1 200 tiny distant stars, slow parallax drift
 *   2. Neural web  — 220 network nodes (cobalt = seekers, orange = experts)
 *                    connected by glowing lines, all mouse-interactive
 *   3. Orbital rings — 3 torus rings on independent axes, give 3-D depth
 *
 * Rendering: custom vertex + fragment shaders so every particle renders
 * as a soft glowing orb (hard point → smooth sphere-like glow).
 * Additive blending makes clusters bloom naturally.
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree }         from '@react-three/fiber'
import * as THREE                      from 'three'

// ─── Scene constants ───────────────────────────────────────────────────────
const STAR_COUNT    = 1200
const NODE_COUNT    = 220
const EXPERT_RATIO  = 0.18   // fraction of orange "expert" nodes
const MAX_CONN_DIST = 2.1    // world-units; controls web density

// ─── Brand palette ─────────────────────────────────────────────────────────
const C_COBALT  = new THREE.Color('#1A73E8')
const C_COBALTL = new THREE.Color('#4fa8ff')
const C_ORANGE  = new THREE.Color('#FF6B35')
const C_ORANGEL = new THREE.Color('#ff9966')
const C_STAR    = new THREE.Color('#8B9DC3')

// ─── Glow sprite (64×64 radial gradient, created once) ────────────────────
let _glowTex: THREE.CanvasTexture | null = null
function buildGlowTexture (): THREE.CanvasTexture {
  if (_glowTex) return _glowTex
  const cv  = document.createElement('canvas')
  cv.width  = cv.height = 128
  const ctx = cv.getContext('2d')!
  const g   = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0.00, 'rgba(255,255,255,1.00)')
  g.addColorStop(0.20, 'rgba(255,255,255,0.90)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.45)')
  g.addColorStop(0.75, 'rgba(255,255,255,0.10)')
  g.addColorStop(1.00, 'rgba(255,255,255,0.00)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  _glowTex = new THREE.CanvasTexture(cv)
  return _glowTex
}

// ─── Shaders for the connection-line "pulse" ───────────────────────────────
// Each line-pair stores parameterised t (0 at start vertex, 1 at end vertex)
// as an attribute. A moving bright band sweeps along it every ~3 s.
const LINE_VERT = /* glsl */`
attribute float aT;            // 0.0 → start vertex, 1.0 → end vertex
attribute vec3  aColor;
varying   float vT;
varying   vec3  vColor;
void main() {
  vT     = aT;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const LINE_FRAG = /* glsl */`
uniform float uTime;
varying float vT;
varying vec3  vColor;

void main() {
  // Base dim line
  float base = 0.10;

  // Pulse: bright band that travels 0→1 every ~4 s, unique offset per connection
  // We approximate "per-connection offset" via a hash of the color
  float hash   = fract(vColor.r * 73.3 + vColor.g * 37.1 + vColor.b * 17.7);
  float pulse  = mod(uTime * 0.25 + hash, 1.0);      // 0→1 over ~4 s
  float band   = 1.0 - smoothstep(0.0, 0.12, abs(vT - pulse));
  float alpha  = base + band * 0.55;

  gl_FragColor = vec4(vColor * (1.0 + band * 1.5), alpha);
}
`

// ──────────────────────────────────────────────────────────────────────────
export function ParticleField () {
  const groupRef  = useRef<THREE.Group>(null!)
  const starsRef  = useRef<THREE.Points>(null!)
  const nodesRef  = useRef<THREE.Points>(null!)
  const linesRef  = useRef<THREE.Line>(null!)
  const ring1Ref  = useRef<THREE.Mesh>(null!)
  const ring2Ref  = useRef<THREE.Mesh>(null!)
  const ring3Ref  = useRef<THREE.Mesh>(null!)
  const lineMat   = useRef<THREE.ShaderMaterial>(null!)
  const mouse     = useRef({ x: 0, y: 0 })
  const parallax  = useRef({ x: 0, y: 0 })
  const clock     = useRef(0)
  const { size } = useThree()

  // ── Star positions ────────────────────────────────────────────────────
  const starPos = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 9 + Math.random() * 11
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  // ── Node positions + colors ───────────────────────────────────────────
  const { nodePos, nodeCol } = useMemo(() => {
    const nodePos = new Float32Array(NODE_COUNT * 3)
    const nodeCol = new Float32Array(NODE_COUNT * 3)

    for (let i = 0; i < NODE_COUNT; i++) {
      // Bias toward inner sphere for denser core
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 0.4 + Math.pow(Math.random(), 0.65) * 6.2
      nodePos[i * 3]     =  r * Math.sin(phi) * Math.cos(theta)
      nodePos[i * 3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.72   // slight Y flatten
      nodePos[i * 3 + 2] = (r * Math.cos(phi)) * 0.58

      const isExpert = Math.random() < EXPERT_RATIO
      const col = isExpert
        ? (Math.random() > 0.5 ? C_ORANGE  : C_ORANGEL)
        : (Math.random() > 0.4 ? C_COBALT  : C_COBALTL)
      nodeCol[i * 3]     = col.r
      nodeCol[i * 3 + 1] = col.g
      nodeCol[i * 3 + 2] = col.b
    }
    return { nodePos, nodeCol }
  }, [])

  // ── Connection lines with per-vertex aT and aColor ────────────────────
  const lineGeo = useMemo(() => {
    const pts:    number[] = []
    const ts:     number[] = []
    const colors: number[] = []
    const MAX_D2 = MAX_CONN_DIST * MAX_CONN_DIST

    outer:
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (pts.length > 3000) break outer
        const dx = nodePos[i*3]   - nodePos[j*3]
        const dy = nodePos[i*3+1] - nodePos[j*3+1]
        const dz = nodePos[i*3+2] - nodePos[j*3+2]
        if (dx*dx + dy*dy + dz*dz > MAX_D2) continue

        // Use the color of vertex i for both endpoints (uniform per segment)
        const r = nodeCol[i*3], g = nodeCol[i*3+1], b = nodeCol[i*3+2]

        pts.push(nodePos[i*3], nodePos[i*3+1], nodePos[i*3+2])
        ts.push(0.0);  colors.push(r, g, b)

        pts.push(nodePos[j*3], nodePos[j*3+1], nodePos[j*3+2])
        ts.push(1.0);  colors.push(r, g, b)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts),    3))
    geo.setAttribute('aT',       new THREE.BufferAttribute(new Float32Array(ts),     1))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(new Float32Array(colors), 3))
    return geo
  }, [nodePos, nodeCol])

  // ── Line shader material ───────────────────────────────────────────────
  const lineMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   LINE_VERT,
    fragmentShader: LINE_FRAG,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  }), [])

  // ── Mouse tracking ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const h = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / size.width  - 0.5) * 2
      mouse.current.y = -(e.clientY / size.height - 0.5) * 2
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [size])

  // ── Animation ─────────────────────────────────────────────────────────
  useFrame((state, delta) => {
    clock.current += delta

    // Advance line pulse uniform
    if (lineMaterial.uniforms) {
      lineMaterial.uniforms.uTime.value = clock.current
    }

    // Main group: slow drift
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.022
      groupRef.current.rotation.x += delta * 0.007
    }

    // Mouse parallax: smooth lerp
    parallax.current.x += (mouse.current.y * 0.07 - parallax.current.x) * 0.04
    parallax.current.y += (mouse.current.x * 0.07 - parallax.current.y) * 0.04
    if (groupRef.current) {
      groupRef.current.rotation.x += parallax.current.x * delta
      groupRef.current.rotation.y += parallax.current.y * delta
    }

    // Stars drift slower than group
    if (starsRef.current) {
      starsRef.current.rotation.y = (groupRef.current?.rotation.y ?? 0) * 0.28
      starsRef.current.rotation.x = (groupRef.current?.rotation.x ?? 0) * 0.28
    }

    // Orbital rings — each on independent axis
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.065
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.048
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.035
      ring3Ref.current.rotation.z += delta * 0.022
    }

    // Camera breathing — very subtle sine-wave drift
    const cam = state.camera
    const tt  = clock.current
    cam.position.x += (Math.sin(tt * 0.10) * 0.30 - cam.position.x) * 0.007
    cam.position.y += (Math.cos(tt * 0.07) * 0.20 - cam.position.y) * 0.007
  })

  // ── Glow texture (client-side only) ───────────────────────────────────
  const glowTex = useMemo(() => {
    if (typeof window === 'undefined') return undefined
    return buildGlowTexture()
  }, [])

  return (
    <>
      {/* ── 1. Stars — outside main group so they rotate slower ───── */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={C_STAR}
          size={0.032}
          sizeAttenuation
          transparent
          opacity={0.50}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── 2+3. Network (nodes + lines) rotate together ──────────── */}
      <group ref={groupRef}>

        {/* Connection lines with animated pulse */}
        <lineSegments ref={linesRef as any} geometry={lineGeo}>
          <primitive object={lineMaterial} attach="material" ref={lineMat} />
        </lineSegments>

        {/* Glowing network nodes */}
        <points ref={nodesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodePos,  3]} />
            <bufferAttribute attach="attributes-color"    args={[nodeCol,  3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.13}
            vertexColors
            sizeAttenuation
            transparent
            opacity={1.0}
            map={glowTex}
            alphaMap={glowTex}
            alphaTest={0.004}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* ── 4. Orbital rings — give 3-D depth + identity ─────── */}

        {/* Outer ring — cobalt, lying flat-ish */}
        <mesh ref={ring1Ref} rotation={[Math.PI * 0.08, 0, 0]}>
          <torusGeometry args={[6.8, 0.016, 6, 100]} />
          <meshBasicMaterial
            color="#1A73E8"
            transparent
            opacity={0.13}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Mid ring — orange, tilted */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3.2, Math.PI / 7, 0]}>
          <torusGeometry args={[4.8, 0.013, 6, 80]} />
          <meshBasicMaterial
            color="#FF6B35"
            transparent
            opacity={0.11}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Inner ring — light cobalt, steep angle */}
        <mesh ref={ring3Ref} rotation={[-Math.PI / 4.5, Math.PI / 5, Math.PI / 9]}>
          <torusGeometry args={[3.1, 0.011, 6, 56]} />
          <meshBasicMaterial
            color="#4fa8ff"
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

      </group>
    </>
  )
}
