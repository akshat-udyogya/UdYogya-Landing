'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface PhoneMockupProps {
  screenColor?: string
  screenIndex?: number
  scale?: number
  autoRotate?: boolean
  glowHalo?: boolean
}

/* ─── canvas helpers ──────────────────────────────────── */

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function fillRR(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  rr(ctx, x, y, w, h, r); ctx.fill()
}

function sfrr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
  fill: string, stroke: string, lw = 1
) {
  rr(ctx, x, y, w, h, r)
  ctx.fillStyle = fill; ctx.fill()
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke()
}

function statusBar(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, 200, 22)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 8px monospace'
  ctx.fillText('9:41', 8, 14)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '8px monospace'
  ctx.fillText('▂▄▆  ⊛', 150, 15)
}

function homeBar(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.beginPath(); ctx.roundRect(70, 388, 60, 4, 2); ctx.fill()
}

/* ─── screen 0: chat ──────────────────────────────────── */
function drawChat(ctx: CanvasRenderingContext2D, accent: string) {
  // Rich dark blue-black bg
  const bg = ctx.createLinearGradient(0, 0, 0, 400)
  bg.addColorStop(0, '#0f1623')
  bg.addColorStop(1, '#080d14')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Header
  ctx.fillStyle = '#1a2235'
  ctx.fillRect(0, 22, 200, 50)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 0.8
  ctx.beginPath(); ctx.moveTo(0, 72); ctx.lineTo(200, 72); ctx.stroke()

  // Avatar circle
  ctx.fillStyle = accent
  ctx.beginPath(); ctx.arc(26, 47, 15, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px sans-serif'
  ctx.fillText('RK', 18, 52)
  // online ring
  ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(38, 58, 4.5, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#0f1623'; ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.arc(38, 58, 4.5, 0, Math.PI * 2); ctx.stroke()

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px sans-serif'
  ctx.fillText('Rajesh Kumar', 46, 43)
  ctx.fillStyle = '#94a3b8'; ctx.font = '7.5px sans-serif'
  ctx.fillText('PLC Engineer  ·  Online', 46, 56)

  // Received bubble
  ctx.fillStyle = '#1e2d47'
  fillRR(ctx, 10, 82, 132, 34, 14)
  ctx.fillStyle = '#e2e8f0'; ctx.font = '7.5px sans-serif'
  ctx.fillText('Hello! How can I help', 18, 95)
  ctx.fillText('with your PLC issue?', 18, 107)

  // Sent bubble (gradient)
  const sg1 = ctx.createLinearGradient(58, 126, 190, 160)
  sg1.addColorStop(0, accent); sg1.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = sg1; fillRR(ctx, 58, 126, 132, 34, 14)
  ctx.fillStyle = '#ffffff'; ctx.font = '7.5px sans-serif'
  ctx.fillText('My Siemens S7 isn\'t', 66, 139)
  ctx.fillText('reading sensor inputs', 66, 151)

  // Received long
  ctx.fillStyle = '#1e2d47'; fillRR(ctx, 10, 170, 152, 52, 14)
  ctx.fillStyle = '#e2e8f0'; ctx.font = '7px sans-serif'
  ctx.fillText('Check DI 16×24V HF module.', 18, 183)
  ctx.fillText('Look at terminals 1–8 for', 18, 194)
  ctx.fillText('loose wiring on CH-3  🔧', 18, 205)
  ctx.fillText('Fixed in under 5 min ✔', 18, 216)

  // Sent short
  const sg2 = ctx.createLinearGradient(98, 230, 190, 252)
  sg2.addColorStop(0, accent); sg2.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = sg2; fillRR(ctx, 98, 230, 92, 24, 12)
  ctx.fillStyle = '#ffffff'; ctx.font = '7.5px sans-serif'
  ctx.fillText('That fixed it! 🙏', 106, 246)

  // Received
  ctx.fillStyle = '#1e2d47'; fillRR(ctx, 10, 264, 152, 24, 12)
  ctx.fillStyle = '#e2e8f0'; ctx.font = '7px sans-serif'
  ctx.fillText('Glad to help! Chat is FREE 😊', 18, 280)

  // Typing dots
  ctx.fillStyle = '#1e2d47'; fillRR(ctx, 10, 298, 52, 24, 12)
  ctx.fillStyle = accent
  for (const x of [24, 33, 42]) { ctx.beginPath(); ctx.arc(x, 310, 4, 0, Math.PI * 2); ctx.fill() }

  // Input area
  ctx.fillStyle = '#131c2b'; ctx.fillRect(0, 330, 200, 58)
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.6
  ctx.beginPath(); ctx.moveTo(0, 330); ctx.lineTo(200, 330); ctx.stroke()
  sfrr(ctx, 10, 338, 144, 32, 16, '#1e2d47', 'rgba(255,255,255,0.15)', 0.8)
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'
  ctx.fillText('Message (FREE forever)...', 22, 358)

  // Send button
  const sbg = ctx.createLinearGradient(163, 338, 194, 370)
  sbg.addColorStop(0, accent); sbg.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = sbg; ctx.beginPath(); ctx.arc(179, 354, 15, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('▶', 173, 359)

  // FREE badge
  ctx.fillStyle = 'rgba(34,197,94,0.2)'; fillRR(ctx, 62, 374, 76, 16, 8)
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 0.8; rr(ctx, 62, 374, 76, 16, 8); ctx.stroke()
  ctx.fillStyle = '#4ade80'; ctx.font = 'bold 7px sans-serif'; ctx.fillText('💬 FREE FOREVER', 68, 385)

  homeBar(ctx)
}

/* ─── screen 1: ai ustaad ────────────────────────────── */
function drawAI(ctx: CanvasRenderingContext2D, accent: string) {
  const bg = ctx.createLinearGradient(0, 0, 0, 400)
  bg.addColorStop(0, '#0e0818'); bg.addColorStop(1, '#07050f')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 200, 400)

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  for (const [x, y, r] of [[18,38,1.5],[185,55,1],[45,115,1.2],[172,92,1.5],[100,28,1],[160,195,1.3],[38,245,1],[130,155,1],[80,200,1.3]] as number[][]) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }

  statusBar(ctx)

  // Header
  const hg = ctx.createLinearGradient(0, 22, 0, 72)
  hg.addColorStop(0, `${accent}80`); hg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = hg; ctx.fillRect(0, 22, 200, 50)

  // Bot avatar
  ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(26, 47, 15, 0, Math.PI * 2); ctx.fill()
  // glint ring
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(26, 47, 15, 0, Math.PI * 2); ctx.stroke()
  // robot face
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(19, 40, 5, 5); ctx.fillRect(27, 40, 5, 5)
  ctx.fillRect(20, 49, 12, 3)

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('Ustaad AI', 46, 43)
  ctx.fillStyle = '#a78bfa'; ctx.font = '7.5px sans-serif'; ctx.fillText('AI Industrial Assistant', 46, 56)
  // pulse dot
  ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(178, 37, 5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = `${accent}44`; ctx.beginPath(); ctx.arc(178, 37, 10, 0, Math.PI * 2); ctx.fill()

  // AI bubble 1
  sfrr(ctx, 10, 82, 158, 56, 14, '#1a0f2e', `${accent}60`, 0.8)
  ctx.fillStyle = '#e2e8f0'; ctx.font = '7.5px sans-serif'
  ctx.fillText('Hi! I\'m Ustaad 🤖 Ask me', 18, 96)
  ctx.fillText('anything — PLC, hydraulics,', 18, 107)
  ctx.fillText('VFDs, SCADA or GST. Free,', 18, 118)
  ctx.fillText('instant expert answers.', 18, 129)

  // User bubble
  const ub = ctx.createLinearGradient(54, 148, 190, 174)
  ub.addColorStop(0, accent); ub.addColorStop(1, '#5b21b6')
  ctx.fillStyle = ub; fillRR(ctx, 54, 148, 136, 26, 12)
  ctx.fillStyle = '#ffffff'; ctx.font = '7.5px sans-serif'
  ctx.fillText('Motor tripping — VFD fault F001', 62, 165)

  // AI response
  sfrr(ctx, 10, 184, 162, 80, 14, '#1a0f2e', `${accent}60`, 0.8)
  ctx.fillStyle = '#e2e8f0'; ctx.font = '7.5px sans-serif'
  ctx.fillText('F001 = Overcurrent fault.', 18, 198)
  ctx.fillStyle = accent; ctx.font = 'bold 7px sans-serif'
  ctx.fillText('① Check motor nameplate amps', 18, 211)
  ctx.fillText('② Verify VFD current limit', 18, 222)
  ctx.fillText('③ Inspect winding resistance', 18, 233)
  ctx.fillText('④ Check mechanical coupling', 18, 244)
  ctx.fillStyle = '#64748b'; ctx.font = '6.5px sans-serif'
  ctx.fillText('Still stuck? Book a human expert →', 18, 257)

  // Thinking dots
  sfrr(ctx, 10, 274, 54, 24, 12, '#1a0f2e', `${accent}44`, 0.6)
  ctx.fillStyle = accent
  for (const x of [24, 33, 42]) { ctx.beginPath(); ctx.arc(x, 286, 4, 0, Math.PI * 2); ctx.fill() }

  // Input
  ctx.fillStyle = '#0d0918'; ctx.fillRect(0, 308, 200, 56)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.6
  ctx.beginPath(); ctx.moveTo(0, 308); ctx.lineTo(200, 308); ctx.stroke()
  sfrr(ctx, 10, 316, 148, 32, 16, '#1a0f2e', `${accent}50`, 0.8)
  ctx.fillStyle = '#64748b'; ctx.font = '8px sans-serif'; ctx.fillText('Ask Ustaad anything...', 22, 336)

  const sbg = ctx.createLinearGradient(163, 316, 194, 348)
  sbg.addColorStop(0, accent); sbg.addColorStop(1, '#5b21b6')
  ctx.fillStyle = sbg; ctx.beginPath(); ctx.arc(179, 332, 15, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('▶', 173, 337)

  // Badge
  ctx.fillStyle = `${accent}25`; fillRR(ctx, 38, 354, 124, 18, 9)
  ctx.strokeStyle = `${accent}70`; ctx.lineWidth = 0.8; rr(ctx, 38, 354, 124, 18, 9); ctx.stroke()
  ctx.fillStyle = '#c4b5fd'; ctx.font = 'bold 7px sans-serif'
  ctx.fillText('⚡ Powered by Anthropic Claude', 44, 366)

  homeBar(ctx)
}

/* ─── screen 2: video call ────────────────────────────── */
function drawVideo(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle = '#080c18'; ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // LIVE badge
  ctx.fillStyle = '#ef4444'; fillRR(ctx, 150, 4, 38, 14, 4)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 7px sans-serif'
  ctx.fillText('⬤ LIVE', 155, 14)

  // Video frame background
  const vg = ctx.createLinearGradient(0, 22, 0, 292)
  vg.addColorStop(0, '#1a2040'); vg.addColorStop(1, '#0a0c18')
  ctx.fillStyle = vg; ctx.fillRect(0, 22, 200, 270)

  // Expert avatar + glow
  ctx.fillStyle = `${accent}30`; ctx.beginPath(); ctx.arc(100, 118, 50, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = `${accent}15`; ctx.beginPath(); ctx.arc(100, 118, 65, 0, Math.PI * 2); ctx.fill()
  const avG = ctx.createLinearGradient(74, 90, 126, 140)
  avG.addColorStop(0, accent); avG.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = avG; ctx.beginPath(); ctx.arc(100, 108, 28, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px sans-serif'; ctx.fillText('RK', 88, 116)
  ctx.fillStyle = avG
  ctx.beginPath(); ctx.ellipse(100, 148, 34, 18, 0, Math.PI, 0, true); ctx.fill()

  // Scan-line ambiance
  ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.lineWidth = 1
  for (let x = 0; x < 200; x += 10) {
    ctx.beginPath(); ctx.moveTo(x, 22); ctx.lineTo(x, 292); ctx.stroke()
  }

  // Name tag
  ctx.fillStyle = 'rgba(0,0,0,0.7)'; fillRR(ctx, 8, 266, 140, 20, 6)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 0.6; rr(ctx, 8, 266, 140, 20, 6); ctx.stroke()
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 7.5px sans-serif'
  ctx.fillText('Rajesh Kumar — PLC Expert', 14, 279)
  ctx.fillStyle = '#94a3b8'; ctx.font = '7px sans-serif'; ctx.fillText('32:14', 164, 279)

  // PiP self-view
  sfrr(ctx, 148, 240, 46, 36, 8, '#131c35', 'rgba(255,255,255,0.3)', 1)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(171, 254, 11, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#94a3b8'; ctx.font = '7px sans-serif'; ctx.fillText('You', 164, 270)

  // Control bar
  ctx.fillStyle = '#0d1225'; ctx.fillRect(0, 292, 200, 74)
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.6
  ctx.beginPath(); ctx.moveTo(0, 292); ctx.lineTo(200, 292); ctx.stroke()

  for (const { x, icon, col, lbl } of [
    { x: 22,  icon: '🎤', col: '#1e2d47',  lbl: 'Mute'   },
    { x: 60,  icon: '📷', col: '#1e2d47',  lbl: 'Camera' },
    { x: 100, icon: '⏹', col: '#dc2626',  lbl: 'End'    },
    { x: 140, icon: '💬', col: '#1e2d47',  lbl: 'Chat'   },
    { x: 178, icon: '⋯',  col: '#1e2d47',  lbl: 'More'   },
  ]) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, 318, 18, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 0.8
    ctx.beginPath(); ctx.arc(x, 318, 18, 0, Math.PI * 2); ctx.stroke()
    ctx.font = '12px sans-serif'; ctx.fillText(icon, x - 7, 323)
    ctx.fillStyle = '#94a3b8'; ctx.font = '6px sans-serif'
    ctx.fillText(lbl, x - lbl.length * 1.9, 344)
  }

  // Notes strip
  ctx.fillStyle = '#0a0e1c'; ctx.fillRect(0, 366, 200, 22)
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 0.4
  ctx.beginPath(); ctx.moveTo(0, 366); ctx.lineTo(200, 366); ctx.stroke()
  ctx.fillStyle = '#475569'; ctx.font = '7.5px sans-serif'
  ctx.fillText('📝  Consultation notes...', 10, 380)

  homeBar(ctx)
}

/* ─── screen 3: expert profile ───────────────────────── */
function drawProfile(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle = '#0c1018'; ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Hero gradient
  const hg = ctx.createLinearGradient(0, 22, 200, 120)
  hg.addColorStop(0, `${accent}dd`); hg.addColorStop(0.55, `${accent}55`); hg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = hg; ctx.fillRect(0, 22, 200, 100)

  // Avatar glow rings
  ctx.fillStyle = `${accent}30`; ctx.beginPath(); ctx.arc(100, 80, 44, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = `${accent}15`; ctx.beginPath(); ctx.arc(100, 80, 54, 0, Math.PI * 2); ctx.fill()
  // Avatar
  const avG = ctx.createLinearGradient(76, 56, 124, 104)
  avG.addColorStop(0, '#e0e7ff'); avG.addColorStop(1, accent)
  ctx.fillStyle = avG; ctx.beginPath(); ctx.arc(100, 74, 22, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#1e1b4b'; ctx.font = 'bold 15px sans-serif'; ctx.fillText('PS', 89, 80)
  ctx.fillStyle = avG; ctx.beginPath(); ctx.ellipse(100, 102, 26, 15, 0, Math.PI, 0, true); ctx.fill()

  // Verified badge
  ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(126, 58, 10, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('✓', 121, 62)

  // Name + title
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 13px sans-serif'; ctx.fillText('Priya Sharma', 60, 124)
  ctx.fillStyle = '#94a3b8'; ctx.font = '7.5px sans-serif'; ctx.fillText('Tax & GST Consultant', 65, 136)

  // Stars
  ctx.fillStyle = '#fbbf24'; ctx.font = '12px sans-serif'; ctx.fillText('★★★★★', 48, 154)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('4.9', 100, 154)
  ctx.fillStyle = '#64748b'; ctx.font = '7px sans-serif'; ctx.fillText('(312 reviews)', 114, 154)

  // Stats row
  for (const { v, l, x } of [
    { v: '548',    l: 'Sessions',  x: 10  },
    { v: '<2 min', l: 'Response',  x: 74  },
    { v: '₹800/hr',l: 'Rate',     x: 138 },
  ]) {
    sfrr(ctx, x, 162, 58, 36, 8, '#1a2235', 'rgba(255,255,255,0.15)', 0.6)
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9px sans-serif'; ctx.fillText(v, x + 5, 177)
    ctx.fillStyle = '#64748b'; ctx.font = '6px sans-serif'; ctx.fillText(l, x + 5, 189)
  }

  // Skill tags
  ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('Expertise', 10, 210)
  let tx = 10
  for (const tag of ['GST Filing', 'Income Tax', 'TDS', 'ITR', 'Audit']) {
    const w = tag.length * 5.5 + 14
    if (tx + w > 192) break
    sfrr(ctx, tx, 216, w, 18, 9, `${accent}25`, accent, 0.8)
    ctx.fillStyle = accent; ctx.font = 'bold 7px sans-serif'
    ctx.fillText(tag, tx + 6, 228); tx += w + 6
  }

  // Bio
  ctx.fillStyle = '#64748b'; ctx.font = '7.5px sans-serif'
  ctx.fillText('CA with 12+ yrs in GST, direct &', 10, 250)
  ctx.fillText('indirect tax for SMEs & startups.', 10, 261)

  // Book CTA
  const btnG = ctx.createLinearGradient(12, 272, 188, 304)
  btnG.addColorStop(0, accent); btnG.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = btnG; fillRR(ctx, 12, 272, 176, 32, 12)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9.5px sans-serif'
  ctx.fillText('📅  Book — ₹800/hr', 48, 291)

  // Free chat outline btn
  sfrr(ctx, 12, 312, 176, 28, 12, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.2)', 0.8)
  ctx.fillStyle = '#cbd5e1'; ctx.font = 'bold 8.5px sans-serif'
  ctx.fillText('💬  Start Free Chat', 56, 330)

  // Bottom nav
  ctx.fillStyle = '#0f1623'; ctx.fillRect(0, 348, 200, 40)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.moveTo(0, 348); ctx.lineTo(200, 348); ctx.stroke()
  let ni = 0
  for (const ic of ['🔍', '💬', '🏠', '📋', '👤']) {
    ctx.font = '15px sans-serif'; ctx.fillText(ic, 10 + ni * 38, 374); ni++
  }

  homeBar(ctx)
}

/* ─── screen 4: wallet ────────────────────────────────── */
function drawWallet(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle = '#0a0808'; ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Card glow
  ctx.fillStyle = `${accent}28`; fillRR(ctx, 0, 22, 200, 130, 0)

  // Balance card
  const cg = ctx.createLinearGradient(10, 32, 190, 144)
  cg.addColorStop(0, accent); cg.addColorStop(0.5, '#c2410c'); cg.addColorStop(1, '#7c2d12')
  ctx.fillStyle = cg; fillRR(ctx, 10, 32, 180, 112, 18)

  // Gloss overlay
  const gloss = ctx.createLinearGradient(10, 32, 190, 88)
  gloss.addColorStop(0, 'rgba(255,255,255,0.2)'); gloss.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gloss; fillRR(ctx, 10, 32, 180, 56, 18)

  // Card border
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 0.8
  rr(ctx, 10, 32, 180, 112, 18); ctx.stroke()

  // Chip
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; fillRR(ctx, 148, 82, 28, 20, 4)
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 0.6; rr(ctx, 148, 82, 28, 20, 4); ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(148, 91, 28, 2); ctx.fillRect(157, 82, 2, 20)

  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '7px sans-serif'; ctx.fillText('UDYOGYA WALLET', 20, 54)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 28px sans-serif'; ctx.fillText('₹2,840', 20, 96)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '7px sans-serif'; ctx.fillText('Available Balance', 20, 110)
  ctx.fillStyle = '#4ade80'; ctx.font = 'bold 7.5px sans-serif'; ctx.fillText('↑ +₹1,000 added today', 20, 124)

  // Action buttons
  for (const { x, icon, lbl } of [
    { x: 28,  icon: '⬆', lbl: 'Add Money' },
    { x: 82,  icon: '⬇', lbl: 'Withdraw'  },
    { x: 132, icon: '📜', lbl: 'History'   },
    { x: 178, icon: '🔁', lbl: 'Transfer'  },
  ]) {
    sfrr(ctx, x - 20, 158, 40, 38, 10, '#1a1010', 'rgba(255,255,255,0.15)', 0.7)
    ctx.font = '15px sans-serif'; ctx.fillText(icon, x - 8, 181)
    ctx.fillStyle = '#94a3b8'; ctx.font = '6px sans-serif'
    ctx.fillText(lbl, x - lbl.length * 1.9, 196)
  }

  // Section label
  ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('Recent Transactions', 10, 216)
  ctx.fillStyle = accent; ctx.font = '8px sans-serif'; ctx.fillText('See all →', 156, 216)

  // Transaction rows
  const txns = [
    { icon: '📥', desc: 'Wallet Top-up',           sub: 'Today',     amt: '+₹1,000', pos: true  },
    { icon: '🎥', desc: 'Consultation — Rajesh K.', sub: 'Yesterday', amt: '-₹400',  pos: false },
    { icon: '📥', desc: 'Wallet Top-up',           sub: 'May 20',    amt: '+₹500',  pos: true  },
    { icon: '🎥', desc: 'Consultation — Priya S.', sub: 'May 18',    amt: '-₹260',  pos: false },
  ]
  txns.forEach(({ icon, desc, sub, amt, pos }, i) => {
    const ty = 226 + i * 36
    sfrr(ctx, 10, ty, 180, 30, 8, '#1a1010', 'rgba(255,255,255,0.08)', 0.5)
    ctx.font = '14px sans-serif'; ctx.fillText(icon, 18, ty + 21)
    ctx.fillStyle = '#e2e8f0'; ctx.font = '7.5px sans-serif'; ctx.fillText(desc, 38, ty + 16)
    ctx.fillStyle = '#64748b'; ctx.font = '6.5px sans-serif'; ctx.fillText(sub, 38, ty + 26)
    ctx.fillStyle = pos ? '#4ade80' : '#f87171'; ctx.font = 'bold 9px sans-serif'
    ctx.fillText(amt, 155, ty + 19)
  })

  homeBar(ctx)
}

/* ─── screen 5: gst invoice ──────────────────────────── */
function drawInvoice(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle = '#0a0f0a'; ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Paper card + shadow
  ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6
  ctx.fillStyle = '#f1f5f1'; fillRR(ctx, 8, 28, 184, 356, 14)
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0

  // Header band
  const hg = ctx.createLinearGradient(8, 28, 192, 82)
  hg.addColorStop(0, accent); hg.addColorStop(1, `${accent}cc`)
  ctx.fillStyle = hg; fillRR(ctx, 8, 28, 184, 58, 14)
  ctx.fillStyle = hg; ctx.fillRect(8, 68, 184, 18)

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('UDYOGYA', 18, 52)
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '7px sans-serif'; ctx.fillText('GST TAX INVOICE', 18, 64)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 6.5px sans-serif'
  ctx.fillText('INV-2026-00847', 126, 50); ctx.fillText('23 May 2026', 126, 62)

  // Paid pill in header
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; fillRR(ctx, 148, 70, 38, 14, 7)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 7px sans-serif'; ctx.fillText('✓ PAID', 153, 80)

  // Divider
  ctx.fillStyle = '#cbd5c8'; ctx.fillRect(18, 90, 164, 1)

  // From / To
  ctx.fillStyle = '#9ca3af'; ctx.font = 'bold 6.5px sans-serif'
  ctx.fillText('BILL FROM', 18, 103); ctx.fillText('BILL TO', 116, 103)
  ctx.fillStyle = '#111827'; ctx.font = 'bold 8px sans-serif'
  ctx.fillText('Priya Sharma', 18, 115); ctx.fillText('Akshat Sajwan', 116, 115)
  ctx.fillStyle = '#6b7280'; ctx.font = '6.5px sans-serif'
  ctx.fillText('GSTIN: 27AABCP1234M1Z5', 18, 125); ctx.fillText('New Delhi, 110001', 116, 125)

  ctx.fillStyle = '#cbd5c8'; ctx.fillRect(18, 132, 164, 1)

  // Table header
  ctx.fillStyle = '#e5e9e5'; ctx.fillRect(18, 136, 164, 18)
  ctx.fillStyle = '#374151'; ctx.font = 'bold 6.5px sans-serif'
  ctx.fillText('DESCRIPTION', 22, 148); ctx.fillText('QTY', 130, 148); ctx.fillText('AMT', 158, 148)

  // Items
  ;[
    { d: 'Expert Consultation (GST)', q: '1 hr', a: '₹800' },
    { d: 'Video Call Platform Fee',   q: '1',    a: '₹40'  },
  ].forEach(({ d, q, a }, i) => {
    const iy = 158 + i * 24
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#f8faf8'; ctx.fillRect(18, iy - 10, 164, 22)
    ctx.fillStyle = '#374151'; ctx.font = '7px sans-serif'
    ctx.fillText(d, 22, iy + 5); ctx.fillText(q, 132, iy + 5); ctx.fillText(a, 156, iy + 5)
  })

  ctx.fillStyle = '#cbd5c8'; ctx.fillRect(18, 208, 164, 1)

  // Tax breakdown
  ;[
    { l: 'Subtotal', v: '₹840.00', y: 222 },
    { l: 'CGST 9%',  v: '₹75.60',  y: 234 },
    { l: 'SGST 9%',  v: '₹75.60',  y: 246 },
  ].forEach(({ l, v, y }) => {
    ctx.fillStyle = '#6b7280'; ctx.font = '7px sans-serif'
    ctx.fillText(l, 22, y); ctx.fillText(v, 158, y)
  })

  ctx.fillStyle = '#cbd5c8'; ctx.fillRect(18, 252, 164, 1)

  // Total row
  const tg = ctx.createLinearGradient(18, 256, 182, 278)
  tg.addColorStop(0, accent); tg.addColorStop(1, `${accent}cc`)
  ctx.fillStyle = tg; ctx.fillRect(18, 256, 164, 22)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9px sans-serif'
  ctx.fillText('TOTAL (incl. GST)', 22, 271); ctx.fillText('₹991.20', 142, 271)

  // Paid stamp
  ctx.fillStyle = '#dcfce7'; fillRR(ctx, 54, 284, 92, 20, 10)
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 0.8; rr(ctx, 54, 284, 92, 20, 10); ctx.stroke()
  ctx.fillStyle = '#15803d'; ctx.font = 'bold 7.5px sans-serif'
  ctx.fillText('✓  PAYMENT RECEIVED', 60, 297)

  ctx.fillStyle = '#cbd5c8'; ctx.fillRect(18, 310, 164, 1)

  // Download btn
  const dg = ctx.createLinearGradient(18, 316, 182, 340)
  dg.addColorStop(0, accent); dg.addColorStop(1, `${accent}bb`)
  ctx.fillStyle = dg; fillRR(ctx, 18, 316, 164, 24, 8)
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8.5px sans-serif'
  ctx.fillText('⬇  Download PDF Invoice', 38, 332)

  // Share btn
  sfrr(ctx, 18, 348, 164, 24, 8, '#edf7ed', accent, 0.9)
  ctx.fillStyle = accent; ctx.font = 'bold 8px sans-serif'
  ctx.fillText('↗  Share with Accountant', 40, 364)

  ctx.fillStyle = '#9ca3af'; ctx.font = '6px sans-serif'
  ctx.fillText('System-generated · Valid for ITC claim', 22, 382)

  homeBar(ctx)
}

/* ─── screen dispatcher ───────────────────────────────── */
const DRAW_FNS = [drawChat, drawAI, drawVideo, drawProfile, drawWallet, drawInvoice]

function createScreenTexture(color: string, index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width  = 400
  canvas.height = 800
  const ctx = canvas.getContext('2d')!
  ctx.scale(2, 2)
  const fn = DRAW_FNS[Math.min(index, DRAW_FNS.length - 1)]
  fn(ctx, color)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  // RoundedBox UV has v=0 at top (inverted vs standard Three.js geometry),
  // so flipY=false is needed to display canvas content right-side-up.
  tex.flipY = false
  tex.anisotropy = 4
  return tex
}

/* ─── component ───────────────────────────────────────── */
export function PhoneMockup({
  screenColor = '#1A73E8',
  screenIndex = 0,
  scale = 1,
  autoRotate = false,
  glowHalo = false,
}: PhoneMockupProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const rotated  = useRef(false)

  const texture = useMemo(
    () => createScreenTexture(screenColor, screenIndex),
    [screenColor, screenIndex]
  )

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

        {/* Phone body — silver-gray aluminum */}
        <RoundedBox args={[1.2, 2.4, 0.12]} radius={0.14} smoothness={6}>
          <meshStandardMaterial color="#5a6478" metalness={0.9} roughness={0.1} />
        </RoundedBox>

        {/* Screen — fills 93 % of body width/height (modern thin bezel).
            meshBasicMaterial = unlit, shows texture at full brightness. */}
        <RoundedBox args={[1.12, 2.22, 0.02]} radius={0.08} smoothness={4} position={[0, 0, 0.062]}>
          <meshBasicMaterial map={texture} />
        </RoundedBox>

        {/* Home bar */}
        <RoundedBox args={[0.28, 0.04, 0.01]} radius={0.02} smoothness={2} position={[0, -1.09, 0.075]}>
          <meshBasicMaterial color="#aaaaaa" />
        </RoundedBox>

        {/* Side button — right */}
        <RoundedBox args={[0.025, 0.20, 0.05]} radius={0.01} smoothness={2} position={[0.625, 0.22, 0]}>
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
        </RoundedBox>

        {/* Volume buttons — left */}
        <RoundedBox args={[0.025, 0.14, 0.05]} radius={0.01} smoothness={2} position={[-0.625, 0.40, 0]}>
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.025, 0.14, 0.05]} radius={0.01} smoothness={2} position={[-0.625, 0.18, 0]}>
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
        </RoundedBox>

        {/* Glow halo */}
        {glowHalo && (
          <mesh position={[0, 0, -0.2]}>
            <circleGeometry args={[1.4, 64]} />
            <meshBasicMaterial color={screenColor} transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </Float>
  )
}
