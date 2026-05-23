'use client'
/**
 * DigitalTwinScene v3 — Three industrial modules
 *
 *  1. PLC Rack        — ControlLogix rack, blinking I/O LEDs, CPU display
 *  2. Hydraulic Act   — Pumping piston rod, port indicators
 *  3. Robotic Arm     — 4-axis animated KUKA-style arm with gripper
 *
 * Click any module → fires onModuleClick for the glassmorphism expert panel.
 *
 * FIX: hit-area uses opacity=0.001 (NOT visible=false — Three.js skips
 *      invisible objects during raycasting, so they never fire click events).
 */

import { useRef, useMemo, useState } from 'react'
import { useFrame }                              from '@react-three/fiber'
import { RoundedBox, Environment }               from '@react-three/drei'
import * as THREE                                from 'three'

// ─── Types ─────────────────────────────────────────────────────────────────
export interface ModuleInfo {
  id:           string
  label:        string
  experts:      number
  accentColor:  string
  description:  string
}

interface DigitalTwinSceneProps {
  onModuleClick?:  (info: ModuleInfo) => void
  onHoverChange?:  (hovered: boolean) => void   // fires when any module gains/loses hover
}

export const MODULES: ModuleInfo[] = [
  {
    id:          'plc',
    label:       'PLC & Automation',
    experts:     42,
    accentColor: '#00FFFF',
    description: 'Programmable logic controllers, SCADA, HMI design, industrial automation & process control',
  },
  {
    id:          'hydraulics',
    label:       'Hydraulics & Pneumatics',
    experts:     35,
    accentColor: '#FF6B35',
    description: 'Hydraulic actuators, pneumatic systems, proportional valves, fluid power & troubleshooting',
  },
  {
    id:          'robotics',
    label:       'Robotics & CNC',
    experts:     31,
    accentColor: '#B44FFF',
    description: '6-axis industrial robots, CNC machining, servo systems, motion control & robot programming',
  },
]

// ─── Scrolling grid floor ───────────────────────────────────────────────────
function buildGridTex(): THREE.CanvasTexture {
  const S = 512, cv = document.createElement('canvas')
  cv.width = cv.height = S
  const ctx = cv.getContext('2d')!
  ctx.clearRect(0, 0, S, S)
  ctx.strokeStyle = 'rgba(0,255,255,0.30)'; ctx.lineWidth = 1.2
  for (let i = 64; i < S; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(0,255,255,0.07)'; ctx.lineWidth = 0.5
  for (let i = 16; i < S; i += 16) {
    if (i % 64 === 0) continue
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke()
  }
  const t = new THREE.CanvasTexture(cv)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(10, 10)
  return t
}

function GridFloor() {
  const tex = useMemo(() => typeof window !== 'undefined' ? buildGridTex() : undefined, [])
  useFrame((_, dt) => { if (tex) tex.offset.y -= dt * 0.055 })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.9, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#050A18" map={tex} roughness={0.88} metalness={0.06} transparent opacity={0.90} />
    </mesh>
  )
}

// ─── Ambient particles ──────────────────────────────────────────────────────
// Particle count scales with CPU core count — fewer particles on low-end hardware (#2)
function getParticleCount(): number {
  if (typeof navigator === 'undefined') return 250
  const cores = navigator.hardwareConcurrency ?? 4
  if (cores >= 8) return 450
  if (cores >= 4) return 250
  return 120
}

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const { pos, spd, N } = useMemo(() => {
    const N = getParticleCount()
    const pos = new Float32Array(N * 3), spd = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random()-.5)*20
      pos[i*3+1] = (Math.random()-.5)*10
      pos[i*3+2] = (Math.random()-.5)*12
      spd[i]     = .018 + Math.random()*.038
    }
    return { pos, spd, N }
  }, [])
  useFrame(() => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < N; i++) {
      p[i*3+1] += spd[i]
      if (p[i*3+1] > 5.5) p[i*3+1] = -5.5
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00FFFF" size={0.030} transparent opacity={0.38} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── GLSL pulse lines ───────────────────────────────────────────────────────
const VERT = `
attribute float aT; uniform float uTime; varying float vA;
void main(){
  float b=mod(aT-uTime*.52,1.);
  vA=smoothstep(0.,.14,b)*smoothstep(.30,.14,b);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}`
const FRAG = `
uniform vec3 uColor; varying float vA;
void main(){gl_FragColor=vec4(uColor,vA*.85);}`

function PulseLine({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const SEG = 64
  const obj = useMemo(() => {
    const pts: number[] = [], ts: number[] = []
    for (let i = 0; i <= SEG; i++) {
      const f = i / SEG
      pts.push(from.x+(to.x-from.x)*f, from.y+(to.y-from.y)*f, from.z+(to.z-from.z)*f)
      ts.push(f)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    geo.setAttribute('aT',       new THREE.Float32BufferAttribute(ts,  1))
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    return new THREE.Line(geo, mat)
  }, [from, to, color])
  useFrame(({ clock }) => { (obj.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime() })
  return <primitive object={obj} />
}

// ─── Fake shadow disc — replaces ContactShadows (no extra render pass) (#3) ─
// A single canvas-texture plane baked once; costs one draw call vs. a full
// scene re-render that ContactShadows requires.
function ShadowDisc() {
  const tex = useMemo(() => {
    if (typeof window === 'undefined') return undefined
    const cv = document.createElement('canvas'); cv.width = cv.height = 512
    const ctx = cv.getContext('2d')!
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    g.addColorStop(0,   'rgba(0,3,14,0.75)')
    g.addColorStop(0.45,'rgba(0,3,14,0.38)')
    g.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512)
    return new THREE.CanvasTexture(cv)
  }, [])
  if (!tex) return null
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.88, 0]}>
      <planeGeometry args={[24, 24]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

// ─── PLC I/O LEDs — blink independently via useFrame ──────────────────────
// Each I/O module (4 slots) renders 8 channel LEDs that toggle randomly.
function PLCIOLeds({ slotIdx }: { slotIdx: number }) {
  const refs  = useRef<(THREE.Mesh | null)[]>(new Array(8).fill(null))
  const on    = useRef(Array.from({ length: 8 }, (_, i) => (slotIdx * 8 + i + 1) % 3 !== 0))
  const timer = useRef(Array.from({ length: 8 }, () => Math.random() * 1.5))
  const t     = useRef(0)

  useFrame((_, dt) => {
    t.current += dt
    for (let i = 0; i < 8; i++) {
      if (t.current < timer.current[i]) continue
      on.current[i]    = Math.random() > 0.25          // 75 % chance of being ON
      timer.current[i] = t.current + 0.08 + Math.random() * 2.2
      const mesh = refs.current[i]
      if (!mesh) continue
      const m = mesh.material as THREE.MeshStandardMaterial
      const isOn = on.current[i]
      m.color.set(isOn ? '#00FF55' : '#1A0808')
      m.emissive.set(isOn ? '#00FF55' : '#000000')
      m.emissiveIntensity = isOn ? 0.82 : 0
    }
  })

  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el }}
          position={[-0.09 + (i % 2) * 0.18, 0.28 - Math.floor(i / 2) * 0.115, 0.168]}
        >
          <circleGeometry args={[0.026, 12]} />
          <meshStandardMaterial
            color={on.current[i] ? '#00FF55' : '#1A0808'}
            emissive={on.current[i] ? '#00FF55' : '#000000'}
            emissiveIntensity={on.current[i] ? 0.82 : 0}
          />
        </mesh>
      ))}
    </>
  )
}

// ─── PLC Rack ───────────────────────────────────────────────────────────────
function PLCRack({ hovered, accent }: { hovered: boolean; accent: string }) {
  const ac = new THREE.Color(accent)
  const gi = hovered ? 0.92 : 0.38

  return (
    <group>
      {/* Backplate — deep ocean blue */}
      <RoundedBox args={[4.0, 1.65, 0.11]} radius={0.05} smoothness={3} castShadow>
        <meshStandardMaterial color="#0C1E38" roughness={0.38} metalness={0.62} />
      </RoundedBox>
      {/* Cable raceway top */}
      <RoundedBox args={[3.80, 0.28, 0.20]} radius={0.04} smoothness={2} position={[0, 0.72, 0.13]} castShadow>
        <meshStandardMaterial color="#08142C" roughness={0.50} metalness={0.45} />
      </RoundedBox>
      {[-1.4, -.7, 0, .7, 1.4].map((x, i) => (
        <RoundedBox key={i} args={[0.09, 0.22, 0.22]} radius={0.02} smoothness={2} position={[x, 0.72, 0.16]}>
          <meshStandardMaterial color="#060E1A" roughness={0.68} />
        </RoundedBox>
      ))}
      {/* DIN rail — bright steel-blue */}
      <RoundedBox args={[3.65, 0.058, 0.026]} radius={0.013} smoothness={2} position={[0, -0.02, 0.22]}>
        <meshStandardMaterial color="#4A78A0" roughness={0.18} metalness={0.96} />
      </RoundedBox>

      {/* Power Supply — bold saturated navy */}
      <group position={[-1.60, -0.07, 0.24]}>
        <RoundedBox args={[0.60, 1.08, 0.35]} radius={0.04} smoothness={3} castShadow>
          <meshStandardMaterial color="#0E3068" roughness={0.36} metalness={0.52} />
        </RoundedBox>
        {[-.20, -.09, .02, .13].map((y, i) => (
          <RoundedBox key={i} args={[0.40, 0.046, 0.045]} radius={0.02} smoothness={2} position={[0, y, 0.19]}>
            <meshStandardMaterial color="#06101C" roughness={0.7} />
          </RoundedBox>
        ))}
        <mesh position={[0.20, 0.34, 0.185]}>
          <circleGeometry args={[0.042, 16]} />
          <meshStandardMaterial color="#00FF55" emissive="#00FF55" emissiveIntensity={gi} />
        </mesh>
        <mesh position={[0.20, 0.24, 0.185]}>
          <circleGeometry args={[0.036, 16]} />
          <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={gi * 0.7} />
        </mesh>
        <RoundedBox args={[0.52, 0.13, 0.18]} radius={0.02} smoothness={2} position={[0, -0.62, 0.07]}>
          <meshStandardMaterial color="#060E1C" roughness={0.7} />
        </RoundedBox>
      </group>

      {/* CPU Module — deep cobalt blue */}
      <group position={[-0.88, -0.07, 0.24]}>
        <RoundedBox args={[0.44, 1.08, 0.34]} radius={0.04} smoothness={3} castShadow>
          <meshStandardMaterial color="#0C2050" roughness={0.34} metalness={0.52} />
        </RoundedBox>
        <RoundedBox args={[0.30, 0.22, 0.027]} radius={0.03} smoothness={2} position={[0, 0.29, 0.178]}>
          <meshStandardMaterial color="#020810" roughness={0.08} metalness={0.04} />
        </RoundedBox>
        <RoundedBox args={[0.20, 0.038, 0.022]} radius={0.012} smoothness={2} position={[0, 0.31, 0.192]}>
          <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={0.65} />
        </RoundedBox>
        <RoundedBox args={[0.16, 0.032, 0.022]} radius={0.012} smoothness={2} position={[-0.01, 0.262, 0.192]}>
          <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={0.42} />
        </RoundedBox>
        {(['#00FF55', '#FF2244', '#FFB800'] as const).map((c, i) => (
          <mesh key={i} position={[0.17, 0.09 - i * 0.07, 0.185]}>
            <circleGeometry args={[0.028, 12]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i === 0 ? gi : (i === 2 ? gi*.6 : .06)} />
          </mesh>
        ))}
        <mesh position={[0, -0.28, 0.182]}>
          <cylinderGeometry args={[0.056, 0.056, 0.042, 16]} />
          <meshStandardMaterial color="#2A4870" roughness={0.24} metalness={0.92} />
        </mesh>
      </group>

      {/* 4 × I/O modules with blinking LEDs */}
      {[0, 1, 2, 3].map(idx => (
        <group key={idx} position={[-0.28 + idx * 0.50, -0.07, 0.24]}>
          <RoundedBox args={[0.38, 1.08, 0.32]} radius={0.036} smoothness={3} castShadow>
            <meshStandardMaterial color="#0C1C38" roughness={0.44} metalness={0.48} />
          </RoundedBox>
          {/* Animated blinking LEDs */}
          <PLCIOLeds slotIdx={idx} />
          <RoundedBox args={[0.30, 0.060, 0.016]} radius={0.008} smoothness={2} position={[0, -0.40, 0.168]}>
            <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={0.32} />
          </RoundedBox>
          <RoundedBox args={[0.32, 0.115, 0.14]} radius={0.022} smoothness={2} position={[0, -0.64, 0.06]}>
            <meshStandardMaterial color="#06101A" roughness={0.7} />
          </RoundedBox>
        </group>
      ))}

      <pointLight position={[0, 0.6, 1.4]}  color={accent} intensity={hovered ? 3.2 : 0.72} distance={5} />
      <pointLight position={[0, -0.5, 1.4]} color={accent} intensity={hovered ? 1.2 : 0.22} distance={3.5} />
    </group>
  )
}

// ─── Hydraulic Actuator ─────────────────────────────────────────────────────
// Piston position driven ONLY by useFrame — no JSX position prop on animated group
// (JSX position prop gets reconciled back on parent re-render when hovered changes)
function HydraulicActuator({ hovered, accent }: { hovered: boolean; accent: string }) {
  const pistonRef = useRef<THREE.Group>(null!)
  const phase     = useRef(0)
  const ac        = new THREE.Color(accent)

  useFrame((_, dt) => {
    phase.current += dt * (hovered ? 2.1 : 1.0)
    if (pistonRef.current) {
      // Amplitude capped at 0.30 so the rod bottom never rises above the gland seal
      pistonRef.current.position.y = 1.05 + Math.sin(phase.current) * 0.30
    }
  })

  return (
    <group>
      {/* Base clevis — dark olive-steel */}
      <RoundedBox args={[0.90, 0.22, 0.70]} radius={0.055} smoothness={2} position={[0, -1.32, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1C2A1A" roughness={0.48} metalness={0.68} />
      </RoundedBox>
      <mesh position={[0, -1.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.058, 0.058, 1.05, 12]} />
        <meshStandardMaterial color="#5A7860" roughness={0.18} metalness={0.98} />
      </mesh>

      {/* Cylinder body — forest steel green */}
      <mesh position={[0, -0.22, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 2.20, 28]} />
        <meshStandardMaterial color="#162420" roughness={0.30} metalness={0.72} />
      </mesh>
      {/* End caps — slightly lighter olive */}
      {[0.90, -1.32].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.15, 28]} />
          <meshStandardMaterial color="#1E3028" roughness={0.28} metalness={0.76} />
        </mesh>
      ))}
      {/* Gland seal */}
      <mesh position={[0, 1.00, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.09, 20]} />
        <meshStandardMaterial color="#1C2C24" roughness={0.26} metalness={0.82} />
      </mesh>

      {/* 4 tie rods — bright steel-teal */}
      {[[.31,.31],[.31,-.31],[-.31,.31],[-.31,-.31]].map(([x,z],i) => (
        <mesh key={i} position={[x,-0.20,z]} castShadow>
          <cylinderGeometry args={[0.031, 0.031, 2.48, 8]} />
          <meshStandardMaterial color="#3A5848" roughness={0.18} metalness={0.96} />
        </mesh>
      ))}

      {/* Animated piston rod — position set only in useFrame */}
      <group ref={pistonRef}>
        <mesh>
          <cylinderGeometry args={[0.118, 0.118, 1.25, 20]} />
          <meshStandardMaterial color="#7AAAB8" roughness={0.08} metalness={0.99} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <cylinderGeometry args={[0.124, 0.124, 0.038, 20]} />
          <meshStandardMaterial color="#9AC0CC" roughness={0.04} metalness={1.0} />
        </mesh>
        <RoundedBox args={[0.26, 0.30, 0.44]} radius={0.055} smoothness={2} position={[0, 0.75, 0]} castShadow>
          <meshStandardMaterial color="#1C2820" roughness={0.30} metalness={0.78} />
        </RoundedBox>
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.062, 0.062, 0.52, 12]} />
          <meshStandardMaterial color="#4A6858" roughness={0.18} metalness={0.98} />
        </mesh>
      </group>

      {/* Hydraulic ports */}
      {[0.50, -0.90].map((y, i) => (
        <group key={i} position={[0.40, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.062, 0.062, 0.20, 10]} />
            <meshStandardMaterial color="#1C2C28" roughness={0.28} metalness={0.88} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.088, 0.088, 0.085, 6]} />
            <meshStandardMaterial color="#304A44" roughness={0.22} metalness={0.92} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <circleGeometry args={[0.028, 10]} />
            <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={hovered ? 0.9 : 0.30} />
          </mesh>
        </group>
      ))}

      {/* Position sensor strip */}
      <RoundedBox args={[0.075, 1.90, 0.045]} radius={0.022} smoothness={2} position={[-0.45, -0.20, 0]}>
        <meshStandardMaterial color="#141E1C" roughness={0.46} metalness={0.50} />
      </RoundedBox>

      <pointLight position={[1.1, 0.5, 0.5]} color={accent} intensity={hovered ? 2.8 : 0.62} distance={5} />
    </group>
  )
}

// ─── Robotic Arm ────────────────────────────────────────────────────────────
function RoboticArm({ hovered, accent }: { hovered: boolean; accent: string }) {
  const j1 = useRef<THREE.Group>(null!)   // base rotation
  const j2 = useRef<THREE.Group>(null!)   // shoulder
  const j3 = useRef<THREE.Group>(null!)   // elbow
  const j4 = useRef<THREE.Group>(null!)   // wrist
  const fL = useRef<THREE.Group>(null!)   // left finger
  const fR = useRef<THREE.Group>(null!)   // right finger
  const ph = useRef(0)
  const ac = new THREE.Color(accent)

  useFrame((_, dt) => {
    ph.current += dt * (hovered ? 1.6 : 0.85)
    const p = ph.current
    if (j1.current) j1.current.rotation.y =  Math.sin(p * 0.38) * 0.75
    if (j2.current) j2.current.rotation.z = -0.55 + Math.sin(p * 0.60) * 0.38
    if (j3.current) j3.current.rotation.z = -1.20 + Math.sin(p * 0.60 + 1.1) * 0.42
    if (j4.current) j4.current.rotation.z =  Math.sin(p * 0.85 + 0.6) * 0.55
    const o = Math.sin(p * 1.3) * 0.5 + 0.5
    if (fL.current) fL.current.position.x = -(0.065 + o * 0.13)
    if (fR.current) fR.current.position.x =  (0.065 + o * 0.13)
  })

  return (
    <group>
      {/* Base plate — deep void purple */}
      <mesh position={[0, -1.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.68, 0.73, 0.16, 32]} />
        <meshStandardMaterial color="#14102A" roughness={0.36} metalness={0.72} />
      </mesh>

      {/* J1 rotating column */}
      <group ref={j1} position={[0, -1.10, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.50, 0.54, 0.44, 28]} />
          <meshStandardMaterial color="#221848" roughness={0.32} metalness={0.68} />
        </mesh>
        <mesh position={[0, 0.30, 0]}>
          <cylinderGeometry args={[0.42, 0.50, 0.20, 28]} />
          <meshStandardMaterial color="#1C1438" roughness={0.32} metalness={0.68} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <torusGeometry args={[0.46, 0.022, 8, 32]} />
          <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={hovered ? 0.95 : 0.38} />
        </mesh>

        {/* J2 shoulder pivot */}
        <group position={[0, 0.42, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.80, 20]} />
            <meshStandardMaterial color="#18163C" roughness={0.28} metalness={0.76} />
          </mesh>
          <group ref={j2}>
            <RoundedBox args={[0.24, 1.42, 0.24]} radius={0.065} smoothness={3} position={[0, 0.72, 0]} castShadow>
              <meshStandardMaterial color="#1A1640" roughness={0.32} metalness={0.68} />
            </RoundedBox>
            {/* J3 elbow */}
            <group position={[0, 1.46, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.19, 0.19, 0.64, 18]} />
                <meshStandardMaterial color="#18163C" roughness={0.28} metalness={0.76} />
              </mesh>
              <group ref={j3}>
                <RoundedBox args={[0.19, 1.10, 0.19]} radius={0.055} smoothness={3} position={[0, 0.56, 0]} castShadow>
                  <meshStandardMaterial color="#1A1640" roughness={0.32} metalness={0.68} />
                </RoundedBox>
                {/* J4 wrist */}
                <group position={[0, 1.14, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.135, 0.135, 0.45, 16]} />
                    <meshStandardMaterial color="#201C48" roughness={0.28} metalness={0.76} />
                  </mesh>
                  <group ref={j4}>
                    <mesh position={[0, 0.20, 0]}>
                      <cylinderGeometry args={[0.145, 0.145, 0.34, 16]} />
                      <meshStandardMaterial color="#1A163C" roughness={0.30} metalness={0.72} />
                    </mesh>
                    <mesh position={[0, 0.20, 0]}>
                      <torusGeometry args={[0.150, 0.016, 8, 20]} />
                      <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={hovered ? 1.0 : 0.45} />
                    </mesh>
                    {/* Gripper */}
                    <group position={[0, 0.42, 0]}>
                      <RoundedBox args={[0.38, 0.15, 0.13]} radius={0.03} smoothness={2}>
                        <meshStandardMaterial color="#16122E" roughness={0.30} metalness={0.76} />
                      </RoundedBox>
                      <group ref={fL}>
                        <RoundedBox args={[0.085, 0.28, 0.09]} radius={0.022} smoothness={2} position={[0, 0.22, 0]}>
                          <meshStandardMaterial color="#1E1A3A" roughness={0.28} metalness={0.80} />
                        </RoundedBox>
                        <RoundedBox args={[0.075, 0.09, 0.11]} radius={0.022} smoothness={2} position={[0, 0.395, 0]}>
                          <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={0.28} roughness={0.26} metalness={0.78} />
                        </RoundedBox>
                      </group>
                      <group ref={fR}>
                        <RoundedBox args={[0.085, 0.28, 0.09]} radius={0.022} smoothness={2} position={[0, 0.22, 0]}>
                          <meshStandardMaterial color="#1E1A3A" roughness={0.28} metalness={0.80} />
                        </RoundedBox>
                        <RoundedBox args={[0.075, 0.09, 0.11]} radius={0.022} smoothness={2} position={[0, 0.395, 0]}>
                          <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={0.28} roughness={0.26} metalness={0.78} />
                        </RoundedBox>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Mini control box */}
      <RoundedBox args={[0.24, 0.85, 0.20]} radius={0.03} smoothness={2} position={[-0.65, -0.90, 0]} castShadow>
        <meshStandardMaterial color="#10102A" roughness={0.44} metalness={0.50} />
      </RoundedBox>
      <mesh position={[-0.65, -0.54, 0.115]}>
        <circleGeometry args={[0.032, 14]} />
        <meshStandardMaterial color={accent} emissive={ac} emissiveIntensity={hovered ? 1.1 : 0.50} />
      </mesh>

      <pointLight position={[0, 1.2, 1.3]} color={accent} intensity={hovered ? 3.0 : 0.72} distance={6} />
    </group>
  )
}

// ─── Module wrapper ─────────────────────────────────────────────────────────
// IMPORTANT: hit-area uses opacity=0.001, NOT visible=false.
// Three.js raycaster skips objects where mesh.visible === false, so
// visible={false} hit boxes never fire pointer/click events.
function ModuleWrapper({
  position, info, onModuleClick, onHoverChange, children
}: {
  position: [number, number, number]
  info: ModuleInfo
  onModuleClick?:  (info: ModuleInfo) => void
  onHoverChange?:  (hovered: boolean) => void
  children: (hovered: boolean, accent: string) => React.ReactNode
}) {
  const ref    = useRef<THREE.Group>(null!)
  const scaleV = useRef(new THREE.Vector3(1, 1, 1))
  const [hovered, setHovered] = useState(false)

  useFrame(({ gl }, dt) => {
    gl.domElement.style.cursor = hovered ? 'pointer' : 'default'
    scaleV.current.setScalar(hovered ? 1.065 : 1.0)
    ref.current?.scale.lerp(scaleV.current, dt * 7)
  })

  return (
    <group
      ref={ref}
      position={position}
      onPointerEnter={e => { e.stopPropagation(); setHovered(true);  onHoverChange?.(true)  }}
      onPointerLeave={e => { e.stopPropagation(); setHovered(false); onHoverChange?.(false) }}
      onClick={e        => { e.stopPropagation(); onModuleClick?.(info) }}
    >
      {children(hovered, info.accentColor)}
      {/* Transparent hit-area — visible:true so raycaster picks it up */}
      <mesh>
        <boxGeometry args={[4.8, 4.2, 3.2]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────
export function DigitalTwinScene({ onModuleClick, onHoverChange }: DigitalTwinSceneProps) {
  const P0: [number, number, number] = [-4.0, 0.0,  0.25]   // PLC
  const P1: [number, number, number] = [ 0.0, 0.0, -0.25]   // Hydraulic
  const P2: [number, number, number] = [ 4.0, 0.0,  0.25]   // Robotic Arm

  const v0 = useMemo(() => new THREE.Vector3(...P0), [])
  const v1 = useMemo(() => new THREE.Vector3(...P1), [])
  const v2 = useMemo(() => new THREE.Vector3(...P2), [])

  return (
    <>
      <Environment preset="warehouse" />

      {/* Key light w/ shadow map */}
      <directionalLight
        position={[8, 14, 8]} intensity={0.85} color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14} shadow-camera-right={14}
        shadow-camera-top={10}  shadow-camera-bottom={-6}
        shadow-camera-far={50}
      />
      <directionalLight position={[-6, 5, 5]} intensity={0.28} color="#3050FF" />
      <pointLight        position={[0, 8, 4]} intensity={0.45} color="#4488FF" />
      <ambientLight intensity={0.14} />

      <GridFloor />
      <ShadowDisc />
      <Particles />

      {/* Data pulse connections */}
      <PulseLine from={v0} to={v1} color="#00FFFF" />
      <PulseLine from={v1} to={v2} color="#FF6B35" />

      <ModuleWrapper position={P0} info={MODULES[0]} onModuleClick={onModuleClick} onHoverChange={onHoverChange}>
        {(h, a) => <PLCRack            hovered={h} accent={a} />}
      </ModuleWrapper>

      <ModuleWrapper position={P1} info={MODULES[1]} onModuleClick={onModuleClick} onHoverChange={onHoverChange}>
        {(h, a) => <HydraulicActuator  hovered={h} accent={a} />}
      </ModuleWrapper>

      <ModuleWrapper position={P2} info={MODULES[2]} onModuleClick={onModuleClick} onHoverChange={onHoverChange}>
        {(h, a) => <RoboticArm         hovered={h} accent={a} />}
      </ModuleWrapper>
    </>
  )
}
