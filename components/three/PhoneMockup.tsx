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

/* ─── helpers ─────────────────────────────────────────── */

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}

function statusBar(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(0, 0, 200, 22)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = 'bold 8px sans-serif'
  ctx.fillText('9:41', 8, 14)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '8px sans-serif'
  ctx.fillText('▐▐▐ ▂▄▆ ⊛', 148, 15)
}

function homeBar(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.beginPath()
  ctx.roundRect(70, 386, 60, 4, 2)
  ctx.fill()
}

/* ─── screen 0: free expert chat ─────────────────────── */
function drawChat(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = '#0d1117'
  ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Header
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(0, 22, 200, 48)
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(26, 46, 14, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 9px sans-serif'
  ctx.fillText('RK', 19, 50)
  ctx.fillStyle = '#22c55e'
  ctx.beginPath(); ctx.arc(38, 56, 4, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = 'bold 9px sans-serif'
  ctx.fillText('Rajesh Kumar', 46, 42)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '7px sans-serif'
  ctx.fillText('PLC Engineer · Online', 46, 54)

  // Received bubble
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  fillRoundRect(ctx, 10, 82, 130, 30, 10)
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '7px sans-serif'
  ctx.fillText('Hello! How can I help', 18, 94)
  ctx.fillText('with your PLC issue?', 18, 105)

  // Sent bubble
  ctx.fillStyle = color
  fillRoundRect(ctx, 60, 124, 130, 30, 10)
  ctx.fillStyle = '#fff'
  ctx.font = '7px sans-serif'
  ctx.fillText('My Siemens S7 isn\'t', 68, 136)
  ctx.fillText('reading sensor inputs', 68, 147)

  // Received long
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  fillRoundRect(ctx, 10, 165, 148, 46, 10)
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '7px sans-serif'
  ctx.fillText('Check DI module 16×24V HF.', 18, 178)
  ctx.fillText('Look at terminals 1–8 for', 18, 189)
  ctx.fillText('wiring — likely a loose', 18, 200)
  ctx.fillText('conductor on CH-3 🔧', 18, 211)

  // Sent short
  ctx.fillStyle = color
  fillRoundRect(ctx, 108, 222, 82, 22, 10)
  ctx.fillStyle = '#fff'
  ctx.font = '7px sans-serif'
  ctx.fillText('That was it! 🙏 Thank', 114, 234)

  // Received
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  fillRoundRect(ctx, 10, 254, 120, 22, 10)
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '7px sans-serif'
  ctx.fillText('Happy to help! Chat is', 18, 264)
  ctx.fillText('always FREE 😊', 18, 275)

  // Typing dots
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  fillRoundRect(ctx, 10, 286, 46, 20, 10)
  ctx.fillStyle = color
  for (const x of [22, 30, 38]) {
    ctx.beginPath(); ctx.arc(x, 296, 3, 0, Math.PI * 2); ctx.fill()
  }

  // Input bar
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.fillRect(0, 318, 200, 50)
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  fillRoundRect(ctx, 10, 326, 144, 28, 14)
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.font = '8px sans-serif'
  ctx.fillText('Message (FREE forever)...', 22, 344)
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(176, 340, 13, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('▶', 170, 344)

  // FREE badge
  ctx.fillStyle = '#22c55e'
  fillRoundRect(ctx, 68, 370, 64, 14, 7)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 7px sans-serif'
  ctx.fillText('💬 FREE FOREVER', 74, 380)

  homeBar(ctx)
}

/* ─── screen 1: ai ustaad chatbot ────────────────────── */
function drawAI(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = '#0d0d1a'
  ctx.fillRect(0, 0, 200, 400)

  // Starfield
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  for (const [x, y] of [[18,38],[182,55],[48,118],[174,95],[102,26],[162,198],[38,248],[130,150],[80,200]]) {
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill()
  }

  statusBar(ctx)

  // Header
  ctx.fillStyle = `${color}55`
  ctx.fillRect(0, 22, 200, 48)
  // Bot face
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(26, 46, 13, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.fillRect(19, 39, 5, 5)
  ctx.fillRect(27, 39, 5, 5)
  ctx.fillRect(20, 48, 12, 3)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = 'bold 9px sans-serif'
  ctx.fillText('Ustaad AI', 46, 42)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '7px sans-serif'
  ctx.fillText('Your AI Industrial Assistant', 46, 54)

  // AI bubble 1
  ctx.fillStyle = `${color}30`
  fillRoundRect(ctx, 10, 82, 155, 54, 12)
  ctx.strokeStyle = `${color}80`; ctx.lineWidth = 0.8; ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '7px sans-serif'
  ctx.fillText('Hi! I\'m Ustaad 🤖 Ask me', 18, 96)
  ctx.fillText('anything about PLC, hydraulics,', 18, 107)
  ctx.fillText('VFDs, SCADA or GST — I\'ll', 18, 118)
  ctx.fillText('answer instantly, for free.', 18, 129)

  // User bubble
  ctx.fillStyle = color
  fillRoundRect(ctx, 56, 148, 134, 22, 10)
  ctx.fillStyle = '#fff'
  ctx.font = '7px sans-serif'
  ctx.fillText('Motor tripping — VFD fault F001', 62, 162)

  // AI response bubble
  ctx.fillStyle = `${color}30`
  fillRoundRect(ctx, 10, 182, 162, 76, 12)
  ctx.strokeStyle = `${color}80`; ctx.lineWidth = 0.8; ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '7px sans-serif'
  ctx.fillText('F001 = Overcurrent fault. Steps:', 18, 196)
  ctx.fillStyle = `${color}EE`
  ctx.font = '6.5px sans-serif'
  ctx.fillText('① Check motor nameplate amps', 18, 208)
  ctx.fillText('② Verify VFD current limit setting', 18, 219)
  ctx.fillText('③ Inspect motor winding resistance', 18, 230)
  ctx.fillText('④ Check mechanical load / coupling', 18, 241)
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '6px sans-serif'
  ctx.fillText('Still stuck? Book a human expert →', 18, 253)

  // Thinking indicator
  ctx.fillStyle = `${color}28`
  fillRoundRect(ctx, 10, 270, 50, 20, 10)
  ctx.fillStyle = color
  for (const x of [22, 31, 40]) {
    ctx.beginPath(); ctx.arc(x, 280, 3.5, 0, Math.PI * 2); ctx.fill()
  }

  // Input bar
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fillRect(0, 306, 200, 54)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  fillRoundRect(ctx, 10, 314, 148, 28, 14)
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.font = '8px sans-serif'
  ctx.fillText('Ask Ustaad anything...', 22, 332)
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(176, 328, 12, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 10px sans-serif'
  ctx.fillText('▶', 170, 333)

  // Badge
  ctx.fillStyle = `${color}55`
  fillRoundRect(ctx, 56, 350, 88, 14, 7)
  ctx.strokeStyle = color; ctx.lineWidth = 0.6; ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = 'bold 6.5px sans-serif'
  ctx.fillText('⚡ Powered by Anthropic AI', 62, 360)

  homeBar(ctx)
}

/* ─── screen 2: live video consultation ──────────────── */
function drawVideo(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = '#080812'
  ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Live dot
  ctx.fillStyle = '#ef4444'
  ctx.beginPath(); ctx.arc(182, 11, 5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,0,0,0.25)'
  ctx.beginPath(); ctx.arc(182, 11, 9, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.65)'
  ctx.font = 'bold 6.5px sans-serif'
  ctx.fillText('LIVE', 154, 15)

  // Expert video frame
  const vg = ctx.createLinearGradient(0, 22, 0, 290)
  vg.addColorStop(0, '#1a1f3a')
  vg.addColorStop(1, '#08080f')
  ctx.fillStyle = vg
  ctx.fillRect(0, 22, 200, 268)

  // Expert avatar (large centered)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.beginPath(); ctx.arc(100, 118, 46, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(100, 108, 26, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText('RK', 88, 115)
  // Shoulders
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(100, 148, 30, 18, 0, Math.PI, 0, true)
  ctx.fill()

  // Grid lines (video call ambiance)
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 0.5
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(i * 50, 22); ctx.lineTo(i * 50, 290); ctx.stroke()
  }

  // Name tag
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  fillRoundRect(ctx, 8, 266, 140, 18, 5)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 7px sans-serif'
  ctx.fillText('Rajesh Kumar — PLC Engineer', 14, 278)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '7px sans-serif'
  ctx.fillText('32:14', 160, 278)

  // Self-view PiP
  ctx.fillStyle = '#1a1a2e'
  fillRoundRect(ctx, 148, 238, 46, 36, 6)
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.beginPath(); ctx.arc(171, 253, 9, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '6.5px sans-serif'
  ctx.fillText('You', 165, 268)

  // Control strip
  ctx.fillStyle = 'rgba(0,0,0,0.75)'
  ctx.fillRect(0, 290, 200, 72)

  // Buttons
  const btns = [
    { x: 22,  label: 'Mute', col: 'rgba(255,255,255,0.14)', txt: '🎤' },
    { x: 62,  label: 'Cam',  col: 'rgba(255,255,255,0.14)', txt: '📷' },
    { x: 100, label: 'End',  col: '#dc2626',                txt: '⏹' },
    { x: 138, label: 'Chat', col: 'rgba(255,255,255,0.14)', txt: '💬' },
    { x: 178, label: 'More', col: 'rgba(255,255,255,0.14)', txt: '⋯'  },
  ]
  btns.forEach(({ x, label, col, txt }) => {
    ctx.fillStyle = col
    ctx.beginPath(); ctx.arc(x, 314, 17, 0, Math.PI * 2); ctx.fill()
    ctx.font = '12px sans-serif'
    ctx.fillText(txt, x - 7, 319)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '6px sans-serif'
    ctx.fillText(label, x - label.length * 2, 340)
  })

  // Notes strip
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fillRect(0, 362, 200, 22)
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.font = '7px sans-serif'
  ctx.fillText('📝  Consultation notes...', 10, 376)

  homeBar(ctx)
}

/* ─── screen 3: verified expert profile ──────────────── */
function drawProfile(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = '#0d1117'
  ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Hero band
  const hg = ctx.createLinearGradient(0, 22, 200, 110)
  hg.addColorStop(0, color)
  hg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = hg
  ctx.fillRect(0, 22, 200, 90)

  // Avatar ring
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.beginPath(); ctx.arc(100, 72, 30, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(100, 65, 18, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 13px sans-serif'
  ctx.fillText('PS', 90, 71)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(100, 95, 22, 14, 0, Math.PI, 0, true)
  ctx.fill()

  // Verified badge
  ctx.fillStyle = '#22c55e'
  ctx.beginPath(); ctx.arc(124, 52, 8, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('✓', 120, 56)

  // Name
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'
  ctx.fillText('Priya Sharma', 66, 116)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '7.5px sans-serif'
  ctx.fillText('Tax & GST Consultant', 68, 127)

  // Stars + rating
  ctx.fillStyle = '#fbbf24'; ctx.font = '10px sans-serif'
  ctx.fillText('★★★★★', 50, 144)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('4.9', 98, 144)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '7px sans-serif'; ctx.fillText('(312 reviews)', 112, 144)

  // Stats row
  ;[
    { v: '548', l: 'Sessions', x: 10 },
    { v: '<2 min', l: 'Response', x: 74 },
    { v: '₹800/hr', l: 'Rate', x: 138 },
  ].forEach(({ v, l, x }) => {
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    fillRoundRect(ctx, x, 152, 58, 34, 6)
    ctx.fillStyle = '#fff'; ctx.font = 'bold 8.5px sans-serif'; ctx.fillText(v, x + 5, 167)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '6px sans-serif'; ctx.fillText(l, x + 5, 179)
  })

  // Skill tags
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 8px sans-serif'
  ctx.fillText('Expertise', 10, 200)
  let tx = 10
  for (const tag of ['GST Filing', 'Income Tax', 'TDS', 'ITR', 'Audit']) {
    const w = tag.length * 5.4 + 12
    ctx.fillStyle = `${color}30`
    fillRoundRect(ctx, tx, 206, w, 16, 8)
    ctx.strokeStyle = color; ctx.lineWidth = 0.7; ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '6.5px sans-serif'
    ctx.fillText(tag, tx + 5, 217)
    tx += w + 5
  }

  // Bio
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '7px sans-serif'
  ctx.fillText('CA with 12+ yrs in GST, direct &', 10, 237)
  ctx.fillText('indirect tax for SMEs & startups.', 10, 247)

  // Book CTA
  ctx.fillStyle = color
  fillRoundRect(ctx, 12, 258, 176, 32, 10)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'
  ctx.fillText('📅  Book Consultation — ₹800/hr', 22, 278)

  // Free chat CTA
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  fillRoundRect(ctx, 12, 298, 176, 26, 10)
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '8px sans-serif'
  ctx.fillText('💬  Start Free Chat', 60, 315)

  // Bottom nav
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(0, 344, 200, 42)
  let ni = 0
  for (const ic of ['🔍', '💬', '🏠', '📋', '👤']) {
    ctx.font = '14px sans-serif'; ctx.fillText(ic, 14 + ni * 38, 370); ni++
  }

  homeBar(ctx)
}

/* ─── screen 4: secure wallet ────────────────────────── */
function drawWallet(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Balance card
  const cg = ctx.createLinearGradient(10, 30, 190, 140)
  cg.addColorStop(0, color)
  cg.addColorStop(1, '#7c2d12')
  ctx.fillStyle = cg
  fillRoundRect(ctx, 10, 30, 180, 112, 14)

  // Gloss
  ctx.fillStyle = 'rgba(255,255,255,0.09)'
  ctx.beginPath(); ctx.ellipse(70, 52, 65, 22, -0.3, 0, Math.PI * 2); ctx.fill()

  // Chip
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  fillRoundRect(ctx, 148, 80, 28, 20, 3)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillRect(148, 89, 28, 2)
  ctx.fillRect(157, 80, 2, 20)

  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '7px sans-serif'
  ctx.fillText('Udyogya Wallet', 20, 55)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'
  ctx.fillText('₹2,840', 20, 92)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '7px sans-serif'
  ctx.fillText('Available Balance', 20, 107)
  ctx.fillStyle = '#22c55e'; ctx.font = 'bold 7px sans-serif'
  ctx.fillText('↑ Added ₹1,000 today', 20, 122)

  // Action buttons
  ;[
    { x: 26,  icon: '⬆', label: 'Add Money' },
    { x: 80,  icon: '⬇', label: 'Withdraw' },
    { x: 130, icon: '📜', label: 'History' },
    { x: 178, icon: '🔁', label: 'Transfer' },
  ].forEach(({ x, icon, label }) => {
    ctx.fillStyle = 'rgba(255,255,255,0.09)'
    ctx.beginPath(); ctx.arc(x, 172, 18, 0, Math.PI * 2); ctx.fill()
    ctx.font = '12px sans-serif'; ctx.fillText(icon, x - 7, 177)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '5.5px sans-serif'
    ctx.fillText(label, x - label.length * 1.7, 196)
  })

  // Transactions header
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = 'bold 9px sans-serif'
  ctx.fillText('Recent Transactions', 10, 215)
  ctx.fillStyle = color; ctx.font = '7.5px sans-serif'; ctx.fillText('See all →', 158, 215)

  // Transaction rows
  ;[
    { icon: '📥', desc: 'Wallet Top-up',         sub: 'Today',     amt: '+₹1,000', pos: true  },
    { icon: '🎥', desc: 'Consultation — Rajesh K', sub: 'Yesterday', amt: '-₹400',  pos: false },
    { icon: '📥', desc: 'Wallet Top-up',         sub: 'May 20',    amt: '+₹500',   pos: true  },
    { icon: '🎥', desc: 'Consultation — Priya S.',sub: 'May 18',    amt: '-₹260',  pos: false },
  ].forEach(({ icon, desc, sub, amt, pos }, i) => {
    const ty = 224 + i * 32
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    fillRoundRect(ctx, 10, ty, 180, 26, 7)
    ctx.font = '12px sans-serif'; ctx.fillText(icon, 18, ty + 18)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '7.5px sans-serif'
    ctx.fillText(desc, 36, ty + 13)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '6px sans-serif'
    ctx.fillText(sub, 36, ty + 23)
    ctx.fillStyle = pos ? '#4ade80' : '#f87171'; ctx.font = 'bold 8px sans-serif'
    ctx.fillText(amt, pos ? 160 : 162, ty + 16)
  })

  homeBar(ctx)
}

/* ─── screen 5: gst invoice ──────────────────────────── */
function drawInvoice(ctx: CanvasRenderingContext2D, color: string) {
  // Dark outer
  ctx.fillStyle = '#0e130e'
  ctx.fillRect(0, 0, 200, 400)
  statusBar(ctx)

  // Paper card
  ctx.fillStyle = '#f8faf8'
  fillRoundRect(ctx, 8, 28, 184, 348, 10)

  // Header band
  ctx.fillStyle = color
  fillRoundRect(ctx, 8, 28, 184, 54, 10)
  ctx.fillStyle = color; ctx.fillRect(8, 62, 184, 20)

  ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.font = 'bold 10px sans-serif'
  ctx.fillText('UDYOGYA', 18, 48)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '6.5px sans-serif'
  ctx.fillText('GST Tax Invoice', 18, 60)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '6px sans-serif'
  ctx.fillText('INV-2026-00847', 128, 48)
  ctx.fillText('23 May 2026', 128, 58)
  ctx.fillText('PAID ✓', 148, 68)

  // From / To
  ctx.fillStyle = '#6b7280'; ctx.font = 'bold 6px sans-serif'
  ctx.fillText('FROM', 18, 90)
  ctx.fillStyle = '#111827'; ctx.font = '7px sans-serif'
  ctx.fillText('Priya Sharma', 18, 100)
  ctx.fillStyle = '#6b7280'; ctx.font = '6px sans-serif'
  ctx.fillText('GSTIN: 27AABCP1234M1Z5', 18, 109)

  ctx.fillStyle = '#6b7280'; ctx.font = 'bold 6px sans-serif'
  ctx.fillText('TO', 114, 90)
  ctx.fillStyle = '#111827'; ctx.font = '7px sans-serif'
  ctx.fillText('Akshat Sajwan', 114, 100)
  ctx.fillStyle = '#6b7280'; ctx.font = '6px sans-serif'
  ctx.fillText('New Delhi, 110001', 114, 109)

  // Divider
  ctx.fillStyle = '#e2e8e2'; ctx.fillRect(18, 116, 164, 1)

  // Table header
  ctx.fillStyle = '#f3f4f6'; ctx.fillRect(18, 120, 164, 16)
  ctx.fillStyle = '#374151'; ctx.font = 'bold 6px sans-serif'
  ctx.fillText('DESCRIPTION', 22, 131); ctx.fillText('QTY', 130, 131); ctx.fillText('AMT', 158, 131)

  // Line items
  ;[
    { d: 'Expert Consultation (GST Advice)', q: '1 hr', a: '₹800' },
    { d: 'Video Call Infrastructure Fee',   q: '1',    a: '₹40'  },
  ].forEach(({ d, q, a }, i) => {
    const iy = 140 + i * 22
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#f9fafb'
    ctx.fillRect(18, iy - 8, 164, 20)
    ctx.fillStyle = '#374151'; ctx.font = '6.5px sans-serif'
    ctx.fillText(d, 22, iy + 5); ctx.fillText(q, 132, iy + 5); ctx.fillText(a, 156, iy + 5)
  })

  ctx.fillStyle = '#e2e8e2'; ctx.fillRect(18, 186, 164, 1)

  // Tax breakdown
  ctx.font = '6.5px sans-serif'
  ;[
    { l: 'Subtotal',   v: '₹840.00',   y: 200, col: '#6b7280' },
    { l: 'CGST (9%)',  v: '₹75.60',    y: 211, col: '#6b7280' },
    { l: 'SGST (9%)',  v: '₹75.60',    y: 222, col: '#6b7280' },
  ].forEach(({ l, v, y, col }) => {
    ctx.fillStyle = col; ctx.fillText(l, 22, y); ctx.fillText(v, 158, y)
  })

  ctx.fillStyle = '#e2e8e2'; ctx.fillRect(18, 228, 164, 1)

  // Total row
  ctx.fillStyle = color; ctx.fillRect(18, 232, 164, 20)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'
  ctx.fillText('TOTAL (incl. GST)', 22, 245); ctx.fillText('₹991.20', 148, 245)

  // Paid stamp
  ctx.fillStyle = '#dcfce7'; fillRoundRect(ctx, 58, 260, 84, 16, 8)
  ctx.fillStyle = '#15803d'; ctx.font = 'bold 7px sans-serif'
  ctx.fillText('✓  PAYMENT RECEIVED', 65, 271)

  // Divider
  ctx.fillStyle = '#e2e8e2'; ctx.fillRect(18, 283, 164, 1)

  // Download button
  ctx.fillStyle = color; fillRoundRect(ctx, 18, 290, 164, 22, 8)
  ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'
  ctx.fillText('⬇  Download PDF Invoice', 44, 305)

  // Share button
  ctx.fillStyle = '#f0fdf4'
  fillRoundRect(ctx, 18, 320, 164, 22, 8)
  ctx.strokeStyle = color; ctx.lineWidth = 0.8; ctx.stroke()
  ctx.fillStyle = color; ctx.font = 'bold 8px sans-serif'
  ctx.fillText('↗  Share with Accountant', 42, 335)

  // Footer
  ctx.fillStyle = '#9ca3af'; ctx.font = '5.5px sans-serif'
  ctx.fillText('System-generated GST invoice. Valid for tax claim.', 18, 356)
  ctx.fillText('Registered under CGST Act, 2017.', 44, 364)

  homeBar(ctx)
}

/* ─── screen router ───────────────────────────────────── */

const DRAW_FNS = [drawChat, drawAI, drawVideo, drawProfile, drawWallet, drawInvoice]

function createScreenTexture(color: string, index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width  = 200
  canvas.height = 400
  const ctx = canvas.getContext('2d')!
  const fn = DRAW_FNS[index] ?? DRAW_FNS[0]
  fn(ctx, color)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ─── PhoneMockup component ───────────────────────────── */

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
        {/* Phone body */}
        <RoundedBox args={[1.2, 2.4, 0.12]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} />
        </RoundedBox>

        {/* Screen */}
        <RoundedBox args={[1.0, 2.0, 0.01]} radius={0.06} smoothness={4} position={[0, 0, 0.065]}>
          <meshStandardMaterial map={texture} />
        </RoundedBox>

        {/* Home bar */}
        <RoundedBox args={[0.28, 0.04, 0.01]} radius={0.02} smoothness={4} position={[0, -1.05, 0.07]}>
          <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
        </RoundedBox>

        {/* Glow halo */}
        {glowHalo && (
          <mesh position={[0, 0, -0.2]}>
            <circleGeometry args={[1.4, 64]} />
            <meshBasicMaterial color={screenColor} transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </Float>
  )
}
