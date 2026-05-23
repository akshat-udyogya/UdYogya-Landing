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

/* ─── drawing utils ───────────────────────────────────── */

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

function strokeFillRR(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke: string, lw = 1) {
  ctx.fillStyle = fill; rr(ctx, x, y, w, h, r); ctx.fill()
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke()
}

// glowing circle behind an element
function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha = 0.35) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color.replace(')', `,${alpha})`).replace('rgb(', 'rgba('))
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
}

function statusBar(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.fillRect(0, 0, 200, 22)
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = 'bold 8px ui-monospace,monospace'
  ctx.fillText('9:41', 8, 14)
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '8px ui-monospace,monospace'
  ctx.fillText('▂▄▆ ⊛', 152, 15)
}

function homeBar(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.beginPath(); ctx.roundRect(70, 388, 60, 4, 2); ctx.fill()
}

/* ─── screen 0: free expert chat ─────────────────────── */
function drawChat(ctx: CanvasRenderingContext2D, accent: string) {
  // deep charcoal base
  const bg = ctx.createLinearGradient(0, 0, 0, 400)
  bg.addColorStop(0, '#0a0c10')
  bg.addColorStop(1, '#060709')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 200, 400)

  // subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5
  for (let y = 0; y < 400; y += 28) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(200,y); ctx.stroke() }

  statusBar(ctx)

  // header glass
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.fillRect(0, 22, 200, 50)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.moveTo(0,72); ctx.lineTo(200,72); ctx.stroke()

  // avatar with glow
  glow(ctx, 26, 47, 26, 'rgb(30,120,255)', 0.4)
  const ag = ctx.createLinearGradient(12, 33, 40, 61)
  ag.addColorStop(0, accent); ag.addColorStop(1, '#1a50cc')
  ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(26, 47, 14, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('RK', 19, 51)
  // online dot
  ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(37, 57, 4, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = 'rgba(34,197,94,0.35)'; ctx.beginPath(); ctx.arc(37, 57, 7, 0, Math.PI*2); ctx.fill()

  ctx.fillStyle = '#fff'; ctx.font = 'bold 9.5px -apple-system,sans-serif'
  ctx.fillText('Rajesh Kumar', 46, 43)
  ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.font = '7px sans-serif'
  ctx.fillText('PLC Engineer  ·  Online now', 46, 55)

  // messages
  // recv
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  fillRR(ctx, 10, 82, 130, 32, 12)
  ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=0.6; rr(ctx,10,82,130,32,12); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.font='7.5px sans-serif'
  ctx.fillText('Hello! How can I help', 18, 94); ctx.fillText('with your PLC issue?', 18, 105)

  // sent
  const sg = ctx.createLinearGradient(60,124,190,154)
  sg.addColorStop(0, accent); sg.addColorStop(1,'#1a3ecc')
  ctx.fillStyle = sg; fillRR(ctx, 60, 124, 130, 32, 12)
  ctx.fillStyle='#fff'; ctx.font='7.5px sans-serif'
  ctx.fillText('My Siemens S7 isn\'t', 68, 136); ctx.fillText('reading sensor inputs', 68, 148)

  // recv long
  ctx.fillStyle='rgba(255,255,255,0.07)'
  fillRR(ctx,10,166,148,50,12)
  ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=0.6; rr(ctx,10,166,148,50,12); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.font='7px sans-serif'
  ctx.fillText('Check DI 16×24V HF module.', 18, 179)
  ctx.fillText('Look at terminals 1–8 for', 18, 190)
  ctx.fillText('loose wiring on CH-3 🔧', 18, 201)
  ctx.fillText('Fixed in 5 min ✔', 18, 212)

  // sent short
  const sg2 = ctx.createLinearGradient(100,222,190,244)
  sg2.addColorStop(0,accent); sg2.addColorStop(1,'#1a3ecc')
  ctx.fillStyle=sg2; fillRR(ctx,100,222,90,22,10)
  ctx.fillStyle='#fff'; ctx.font='7px sans-serif'; ctx.fillText('That was it! 🙏', 108, 237)

  // recv free badge
  ctx.fillStyle='rgba(255,255,255,0.07)'
  fillRR(ctx,10,254,148,22,10)
  ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=0.6; rr(ctx,10,254,148,22,10); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.font='7px sans-serif'
  ctx.fillText('Chat is always FREE 😊 No limit!', 18, 268)

  // typing indicator
  ctx.fillStyle='rgba(255,255,255,0.06)'; fillRR(ctx,10,286,48,22,12)
  ctx.fillStyle=accent
  for(const x of [22,31,40]){ctx.beginPath();ctx.arc(x,297,3.5,0,Math.PI*2);ctx.fill()}

  // input bar glass
  ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fillRect(0,318,200,52)
  ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=0.5
  ctx.beginPath(); ctx.moveTo(0,318); ctx.lineTo(200,318); ctx.stroke()
  strokeFillRR(ctx,10,326,144,28,14,'rgba(255,255,255,0.06)','rgba(255,255,255,0.12)')
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='7.5px sans-serif'
  ctx.fillText('Message (FREE)...', 22, 345)

  // send btn glow
  glow(ctx,176,340,18,`rgb(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)})`,0.5)
  const bg2=ctx.createLinearGradient(163,327,189,353)
  bg2.addColorStop(0,accent); bg2.addColorStop(1,'#1a3ecc')
  ctx.fillStyle=bg2; ctx.beginPath(); ctx.arc(176,340,13,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif'; ctx.fillText('▶',170,345)

  // free pill
  ctx.fillStyle='rgba(34,197,94,0.15)'; fillRR(ctx,64,372,72,16,8)
  ctx.strokeStyle='rgba(34,197,94,0.5)'; ctx.lineWidth=0.8; rr(ctx,64,372,72,16,8); ctx.stroke()
  ctx.fillStyle='#4ade80'; ctx.font='bold 7px sans-serif'; ctx.fillText('💬 FREE FOREVER',70,383)

  homeBar(ctx)
}

/* ─── screen 1: ai ustaad ────────────────────────────── */
function drawAI(ctx: CanvasRenderingContext2D, accent: string) {
  const bg = ctx.createLinearGradient(0,0,200,400)
  bg.addColorStop(0,'#07050f'); bg.addColorStop(1,'#0a0512')
  ctx.fillStyle=bg; ctx.fillRect(0,0,200,400)

  // starfield
  ctx.fillStyle='rgba(255,255,255,0.6)'
  for(const [x,y,r] of [[20,35,1.2],[185,55,0.8],[45,115,1],[172,92,1.3],[100,28,0.7],[160,195,1.1],[38,245,0.9],[130,155,0.8],[80,198,1.2],[60,80,0.6]])
    {ctx.beginPath();ctx.arc(x as number,y as number,r as number,0,Math.PI*2);ctx.fill()}

  statusBar(ctx)

  // header
  const hg=ctx.createLinearGradient(0,22,0,72)
  hg.addColorStop(0,`${accent}60`); hg.addColorStop(1,'rgba(0,0,0,0)')
  ctx.fillStyle=hg; ctx.fillRect(0,22,200,50)

  // bot avatar with glow
  glow(ctx,26,47,28,'rgb(147,51,234)',0.5)
  const botG=ctx.createLinearGradient(12,33,40,61)
  botG.addColorStop(0,accent); botG.addColorStop(1,'#5b21b6')
  ctx.fillStyle=botG; ctx.beginPath(); ctx.arc(26,47,14,0,Math.PI*2); ctx.fill()
  // robot face
  ctx.fillStyle='rgba(255,255,255,0.95)'
  ctx.fillRect(19,40,5,5); ctx.fillRect(27,40,5,5); ctx.fillRect(20,49,12,3)

  ctx.fillStyle='#fff'; ctx.font='bold 9.5px sans-serif'; ctx.fillText('Ustaad AI',46,43)
  ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='7px sans-serif'
  ctx.fillText('AI Industrial Assistant',46,55)
  // live indicator
  ctx.fillStyle='#a855f7'; ctx.beginPath(); ctx.arc(176,37,4,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(168,85,247,0.3)'; ctx.beginPath(); ctx.arc(176,37,8,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='6px sans-serif'; ctx.fillText('AI',164,41)

  // AI bubble 1
  const ab1=ctx.createLinearGradient(10,82,165,136)
  ab1.addColorStop(0,`${accent}22`); ab1.addColorStop(1,'rgba(91,33,182,0.12)')
  ctx.fillStyle=ab1; fillRR(ctx,10,82,155,55,14)
  ctx.strokeStyle=`${accent}55`; ctx.lineWidth=0.8; rr(ctx,10,82,155,55,14); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.font='7.5px sans-serif'
  ctx.fillText('Hi! I\'m Ustaad 🤖 Ask me',18,96)
  ctx.fillText('anything — PLC, hydraulics,',18,107)
  ctx.fillText('VFDs, SCADA, GST — free,',18,118)
  ctx.fillText('instant answers.',18,129)

  // user bubble
  const ub=ctx.createLinearGradient(56,148,190,170)
  ub.addColorStop(0,accent); ub.addColorStop(1,'#5b21b6')
  ctx.fillStyle=ub; fillRR(ctx,56,148,134,24,10)
  ctx.fillStyle='#fff'; ctx.font='7px sans-serif'
  ctx.fillText('Motor tripping — VFD fault F001',62,163)

  // AI response
  const ab2=ctx.createLinearGradient(10,182,172,258)
  ab2.addColorStop(0,`${accent}22`); ab2.addColorStop(1,'rgba(91,33,182,0.12)')
  ctx.fillStyle=ab2; fillRR(ctx,10,182,162,78,14)
  ctx.strokeStyle=`${accent}55`; ctx.lineWidth=0.8; rr(ctx,10,182,162,78,14); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.font='7px sans-serif'
  ctx.fillText('F001 = Overcurrent fault.',18,196)
  ctx.fillStyle=accent; ctx.font='bold 6.5px sans-serif'
  ctx.fillText('① Check motor nameplate amps',18,208)
  ctx.fillText('② Verify VFD current limit',18,219)
  ctx.fillText('③ Inspect winding resistance',18,230)
  ctx.fillText('④ Check mechanical load',18,241)
  ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='6px sans-serif'
  ctx.fillText('Still stuck? Book a human expert →',18,253)

  // thinking
  ctx.fillStyle=`${accent}20`; fillRR(ctx,10,270,52,22,11)
  ctx.strokeStyle=`${accent}44`; ctx.lineWidth=0.6; rr(ctx,10,270,52,22,11); ctx.stroke()
  ctx.fillStyle=accent
  for(const x of [23,32,41]){ctx.beginPath();ctx.arc(x,281,3.5,0,Math.PI*2);ctx.fill()}

  // input
  ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fillRect(0,306,200,54)
  strokeFillRR(ctx,10,314,148,28,14,'rgba(255,255,255,0.06)','rgba(255,255,255,0.1)')
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.font='7.5px sans-serif'
  ctx.fillText('Ask Ustaad anything...',22,332)
  glow(ctx,176,328,18,'rgb(147,51,234)',0.55)
  ctx.fillStyle=accent; ctx.beginPath(); ctx.arc(176,328,13,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#fff'; ctx.font='bold 11px sans-serif'; ctx.fillText('▶',170,333)

  // badge
  ctx.fillStyle=`${accent}18`; fillRR(ctx,46,352,108,16,8)
  ctx.strokeStyle=`${accent}55`; ctx.lineWidth=0.7; rr(ctx,46,352,108,16,8); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='bold 6.5px sans-serif'
  ctx.fillText('⚡ Powered by Anthropic Claude',52,362)

  homeBar(ctx)
}

/* ─── screen 2: video consultation ───────────────────── */
function drawVideo(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle='#060810'; ctx.fillRect(0,0,200,400)
  statusBar(ctx)

  // LIVE badge
  ctx.fillStyle='rgba(239,68,68,0.15)'; fillRR(ctx,150,4,36,14,4)
  ctx.strokeStyle='#ef4444'; ctx.lineWidth=0.8; rr(ctx,150,4,36,14,4); ctx.stroke()
  ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(157,11,3,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(239,68,68,0.3)'; ctx.beginPath(); ctx.arc(157,11,6,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#ef4444'; ctx.font='bold 6.5px sans-serif'; ctx.fillText('LIVE',164,15)

  // video area bg
  const vg=ctx.createLinearGradient(0,22,0,294)
  vg.addColorStop(0,'#141830'); vg.addColorStop(1,'#07090f')
  ctx.fillStyle=vg; ctx.fillRect(0,22,200,272)

  // expert glow + avatar
  glow(ctx,100,120,55,`rgb(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)})`,0.22)
  ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.beginPath(); ctx.arc(100,110,40,0,Math.PI*2); ctx.fill()
  const avG=ctx.createLinearGradient(74,84,126,136)
  avG.addColorStop(0,accent); avG.addColorStop(1,'#1a3ecc')
  ctx.fillStyle=avG; ctx.beginPath(); ctx.arc(100,103,24,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#fff'; ctx.font='bold 15px sans-serif'; ctx.fillText('RK',89,110)
  ctx.fillStyle=accent
  ctx.beginPath(); ctx.ellipse(100,140,30,16,0,Math.PI,0,true); ctx.fill()

  // vertical scan lines ambience
  ctx.strokeStyle='rgba(255,255,255,0.015)'; ctx.lineWidth=1
  for(let x=0;x<200;x+=8){ctx.beginPath();ctx.moveTo(x,22);ctx.lineTo(x,294);ctx.stroke()}

  // name tag
  const ntG=ctx.createLinearGradient(8,260,148,278)
  ntG.addColorStop(0,'rgba(0,0,0,0.75)'); ntG.addColorStop(1,'rgba(0,0,0,0.55)')
  ctx.fillStyle=ntG; fillRR(ctx,8,262,136,18,6)
  ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=0.5; rr(ctx,8,262,136,18,6); ctx.stroke()
  ctx.fillStyle='#fff'; ctx.font='bold 7px sans-serif'; ctx.fillText('Rajesh Kumar  —  PLC Engineer',14,274)
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='7px sans-serif'; ctx.fillText('32:14',164,274)

  // PiP self-view
  strokeFillRR(ctx,148,238,46,36,7,'#0f1428','rgba(255,255,255,0.22)',0.8)
  ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.beginPath(); ctx.arc(171,252,10,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='6.5px sans-serif'; ctx.fillText('You',165,268)

  // control strip glass
  const cg=ctx.createLinearGradient(0,294,0,366)
  cg.addColorStop(0,'rgba(10,12,20,0.95)'); cg.addColorStop(1,'rgba(6,8,16,0.98)')
  ctx.fillStyle=cg; ctx.fillRect(0,294,200,72)
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=0.5
  ctx.beginPath(); ctx.moveTo(0,294); ctx.lineTo(200,294); ctx.stroke()

  for(const {x,icon,col,lbl} of [
    {x:20,icon:'🎤',col:'rgba(255,255,255,0.1)',lbl:'Mute'},
    {x:57,icon:'📷',col:'rgba(255,255,255,0.1)',lbl:'Camera'},
    {x:100,icon:'⏹',col:'#dc2626',lbl:'End Call'},
    {x:143,icon:'💬',col:'rgba(255,255,255,0.1)',lbl:'Chat'},
    {x:180,icon:'⋯',col:'rgba(255,255,255,0.1)',lbl:'More'},
  ]){
    glow(ctx,x,317,18,x===100?'rgb(220,38,38)':'rgb(80,80,120)',0.28)
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,317,17,0,Math.PI*2); ctx.fill()
    ctx.font='11px sans-serif'; ctx.fillText(icon,x-7,321)
    ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='5.5px sans-serif'
    ctx.fillText(lbl,x-lbl.length*1.8,340)
  }

  // notes bar
  ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fillRect(0,366,200,22)
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=0.4
  ctx.beginPath(); ctx.moveTo(0,366); ctx.lineTo(200,366); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.font='7px sans-serif'
  ctx.fillText('📝  Consultation notes...',10,380)

  homeBar(ctx)
}

/* ─── screen 3: expert profile ───────────────────────── */
function drawProfile(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle='#080b0f'; ctx.fillRect(0,0,200,400)
  statusBar(ctx)

  // hero gradient band
  const hg=ctx.createLinearGradient(0,22,200,112)
  hg.addColorStop(0,`${accent}cc`); hg.addColorStop(0.6,`${accent}44`); hg.addColorStop(1,'rgba(0,0,0,0)')
  ctx.fillStyle=hg; ctx.fillRect(0,22,200,92)

  // avatar glow + rings
  glow(ctx,100,78,50,`rgb(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)})`,0.4)
  ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(100,78,33,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.beginPath(); ctx.arc(100,78,40,0,Math.PI*2); ctx.fill()
  const avG=ctx.createLinearGradient(76,54,124,102)
  avG.addColorStop(0,'#e0e7ff'); avG.addColorStop(1,accent)
  ctx.fillStyle=avG; ctx.beginPath(); ctx.arc(100,71,20,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#1e1b4b'; ctx.font='bold 14px sans-serif'; ctx.fillText('PS',90,77)
  ctx.fillStyle=accent; ctx.beginPath(); ctx.ellipse(100,98,24,14,0,Math.PI,0,true); ctx.fill()

  // verified badge
  ctx.fillStyle='#22c55e'; ctx.beginPath(); ctx.arc(126,56,9,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(34,197,94,0.3)'; ctx.beginPath(); ctx.arc(126,56,13,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif'; ctx.fillText('✓',121,60)

  // name
  ctx.fillStyle='#fff'; ctx.font='bold 12px -apple-system,sans-serif'; ctx.fillText('Priya Sharma',62,120)
  ctx.fillStyle='rgba(255,255,255,0.42)'; ctx.font='7.5px sans-serif'; ctx.fillText('Tax & GST Consultant',66,131)

  // stars
  ctx.fillStyle='#fbbf24'; ctx.font='11px sans-serif'; ctx.fillText('★★★★★',50,148)
  ctx.fillStyle='#fff'; ctx.font='bold 8.5px sans-serif'; ctx.fillText('4.9',99,148)
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='7px sans-serif'; ctx.fillText('(312 reviews)',113,148)

  // stats glass row
  for(const {v,l,x} of [{v:'548',l:'Sessions',x:10},{v:'<2 min',l:'Response',x:74},{v:'₹800/hr',l:'Rate',x:138}]){
    strokeFillRR(ctx,x,156,58,34,8,'rgba(255,255,255,0.06)','rgba(255,255,255,0.1)',0.6)
    ctx.fillStyle='#fff'; ctx.font='bold 8.5px sans-serif'; ctx.fillText(v,x+5,170)
    ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='6px sans-serif'; ctx.fillText(l,x+5,181)
  }

  // skill tags
  ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='bold 8px sans-serif'; ctx.fillText('Expertise',10,204)
  let tx=10
  for(const tag of ['GST Filing','Income Tax','TDS','ITR','Audit']){
    const w=tag.length*5.4+14
    if(tx+w>192){break}
    ctx.fillStyle=`${accent}20`; fillRR(ctx,tx,210,w,17,9)
    ctx.strokeStyle=accent; ctx.lineWidth=0.7; rr(ctx,tx,210,w,17,9); ctx.stroke()
    ctx.fillStyle=accent; ctx.font='bold 6.5px sans-serif'
    ctx.fillText(tag,tx+6,221); tx+=w+5
  }

  // bio
  ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='7px sans-serif'
  ctx.fillText('CA with 12+ yrs in GST, direct &',10,241)
  ctx.fillText('indirect tax for SMEs & startups.',10,251)

  // book CTA
  glow(ctx,100,275,30,`rgb(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)})`,0.35)
  const btnG=ctx.createLinearGradient(12,260,188,292)
  btnG.addColorStop(0,accent); btnG.addColorStop(1,'#1a3ecc')
  ctx.fillStyle=btnG; fillRR(ctx,12,260,176,32,11)
  ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif'; ctx.fillText('📅  Book — ₹800/hr',44,280)

  // free chat outline
  strokeFillRR(ctx,12,300,176,26,11,'rgba(255,255,255,0.05)','rgba(255,255,255,0.15)',0.8)
  ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='bold 8px sans-serif'; ctx.fillText('💬  Start Free Chat',58,317)

  // bottom nav
  ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fillRect(0,342,200,44)
  ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=0.4
  ctx.beginPath(); ctx.moveTo(0,342); ctx.lineTo(200,342); ctx.stroke()
  let ni=0
  for(const ic of ['🔍','💬','🏠','📋','👤']){ctx.font='14px sans-serif';ctx.fillText(ic,12+ni*38,370);ni++}

  homeBar(ctx)
}

/* ─── screen 4: wallet ────────────────────────────────── */
function drawWallet(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle='#080808'; ctx.fillRect(0,0,200,400)
  statusBar(ctx)

  // balance card
  glow(ctx,100,88,80,`rgb(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)})`,0.3)
  const cg=ctx.createLinearGradient(10,30,190,142)
  cg.addColorStop(0,accent); cg.addColorStop(0.5,'#c2410c'); cg.addColorStop(1,'#7c2d12')
  ctx.fillStyle=cg; fillRR(ctx,10,30,180,112,16)

  // card gloss
  const gloss=ctx.createLinearGradient(10,30,190,90)
  gloss.addColorStop(0,'rgba(255,255,255,0.18)'); gloss.addColorStop(1,'rgba(255,255,255,0)')
  ctx.fillStyle=gloss; fillRR(ctx,10,30,180,56,16)

  // chip
  ctx.fillStyle='rgba(255,255,255,0.28)'; fillRR(ctx,148,82,28,20,3)
  ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=0.6; rr(ctx,148,82,28,20,3); ctx.stroke()
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.fillRect(148,90,28,2); ctx.fillRect(157,82,2,20)

  // card text
  ctx.fillStyle='rgba(255,255,255,0.62)'; ctx.font='7px sans-serif'; ctx.fillText('UDYOGYA WALLET',20,52)
  ctx.fillStyle='#fff'; ctx.font='bold 26px -apple-system,sans-serif'; ctx.fillText('₹2,840',20,94)
  ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.font='7px sans-serif'; ctx.fillText('Available Balance',20,108)
  ctx.fillStyle='#4ade80'; ctx.font='bold 7px sans-serif'; ctx.fillText('↑ +₹1,000 added today',20,122)

  // action buttons
  for(const {x,icon,lbl} of [
    {x:28,icon:'⬆',lbl:'Add Money'},
    {x:82,icon:'⬇',lbl:'Withdraw'},
    {x:130,icon:'📜',lbl:'History'},
    {x:175,icon:'🔁',lbl:'Transfer'},
  ]){
    ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(x,172,18,0,Math.PI*2); ctx.fill()
    ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=0.6; ctx.beginPath(); ctx.arc(x,172,18,0,Math.PI*2); ctx.stroke()
    ctx.font='13px sans-serif'; ctx.fillText(icon,x-7,177)
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='5.5px sans-serif'
    ctx.fillText(lbl,x-lbl.length*1.8,194)
  }

  // txn header
  ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.font='bold 9px sans-serif'; ctx.fillText('Recent Transactions',10,218)
  ctx.fillStyle=accent; ctx.font='7.5px sans-serif'; ctx.fillText('See all →',158,218)

  // rows
  for(const [icon,desc,sub,amt,pos] of [
    ['📥','Wallet Top-up','Today','+₹1,000',true],
    ['🎥','Consultation — Rajesh K.','Yesterday','-₹400',false],
    ['📥','Wallet Top-up','May 20','+₹500',true],
    ['🎥','Consultation — Priya S.','May 18','-₹260',false],
  ] as const){
    const i=[['📥','Wallet Top-up','Today','+₹1,000',true],['🎥','Consultation — Rajesh K.','Yesterday','-₹400',false],['📥','Wallet Top-up','May 20','+₹500',true],['🎥','Consultation — Priya S.','May 18','-₹260',false]].findIndex(r=>r[1]===desc)
    const ty=228+i*36
    ctx.fillStyle='rgba(255,255,255,0.04)'; fillRR(ctx,10,ty,180,30,8)
    ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=0.4; rr(ctx,10,ty,180,30,8); ctx.stroke()
    ctx.font='13px sans-serif'; ctx.fillText(icon,18,ty+21)
    ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.font='7.5px sans-serif'; ctx.fillText(desc,36,ty+16)
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='6px sans-serif'; ctx.fillText(sub,36,ty+26)
    ctx.fillStyle=pos?'#4ade80':'#f87171'; ctx.font='bold 8px sans-serif'; ctx.fillText(amt,155,ty+18)
  }

  homeBar(ctx)
}

/* ─── screen 5: gst invoice ──────────────────────────── */
function drawInvoice(ctx: CanvasRenderingContext2D, accent: string) {
  ctx.fillStyle='#080d08'; ctx.fillRect(0,0,200,400)
  statusBar(ctx)

  // paper card with shadow
  ctx.shadowColor='rgba(0,0,0,0.8)'; ctx.shadowBlur=20; ctx.shadowOffsetY=4
  ctx.fillStyle='#f0f4f0'; fillRR(ctx,8,28,184,352,12)
  ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetY=0

  // header band
  const hg=ctx.createLinearGradient(8,28,192,78)
  hg.addColorStop(0,accent); hg.addColorStop(1,`${accent}cc`)
  ctx.fillStyle=hg; fillRR(ctx,8,28,184,55,12)
  ctx.fillStyle=hg; ctx.fillRect(8,64,184,20)

  ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.font='bold 11px -apple-system,sans-serif'
  ctx.fillText('UDYOGYA',18,50)
  ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='6.5px sans-serif'
  ctx.fillText('GST TAX INVOICE',18,62)
  ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font='bold 6px sans-serif'
  ctx.fillText('INV-2026-00847',128,50); ctx.fillText('23 May 2026',128,60)

  // paid badge in header
  ctx.fillStyle='rgba(255,255,255,0.2)'; fillRR(ctx,148,68,40,14,7)
  ctx.fillStyle='#fff'; ctx.font='bold 6.5px sans-serif'; ctx.fillText('✓ PAID',154,78)

  // divider
  ctx.fillStyle='#d1d5d1'; ctx.fillRect(18,86,164,0.8)

  // from/to
  ctx.fillStyle='#9ca3af'; ctx.font='bold 6px sans-serif'; ctx.fillText('BILL FROM',18,98); ctx.fillText('BILL TO',116,98)
  ctx.fillStyle='#111827'; ctx.font='bold 7.5px sans-serif'
  ctx.fillText('Priya Sharma',18,109); ctx.fillText('Akshat Sajwan',116,109)
  ctx.fillStyle='#6b7280'; ctx.font='6px sans-serif'
  ctx.fillText('GSTIN: 27AABCP1234M1Z5',18,118); ctx.fillText('New Delhi, 110001',116,118)

  ctx.fillStyle='#d1d5d1'; ctx.fillRect(18,124,164,0.8)

  // table header
  ctx.fillStyle='#e9ecef'; ctx.fillRect(18,128,164,16)
  ctx.fillStyle='#374151'; ctx.font='bold 6px sans-serif'
  ctx.fillText('DESCRIPTION',22,139); ctx.fillText('QTY',128,139); ctx.fillText('AMT',158,139)

  // items
  ;[
    {d:'Expert Consultation (GST)',q:'1 hr',a:'₹800'},
    {d:'Video Call Platform Fee',   q:'1',    a:'₹40'},
  ].forEach(({d,q,a},i)=>{
    const iy=148+i*22
    ctx.fillStyle=i%2===0?'#ffffff':'#f8faf8'; ctx.fillRect(18,iy-8,164,20)
    ctx.fillStyle='#374151'; ctx.font='6.5px sans-serif'
    ctx.fillText(d,22,iy+5); ctx.fillText(q,130,iy+5); ctx.fillText(a,156,iy+5)
  })

  ctx.fillStyle='#d1d5d1'; ctx.fillRect(18,196,164,0.8)

  // tax breakdown
  for(const {l,v,y} of [{l:'Subtotal',v:'₹840.00',y:210},{l:'CGST 9%',v:'₹75.60',y:221},{l:'SGST 9%',v:'₹75.60',y:232}]){
    ctx.fillStyle='#6b7280'; ctx.font='6.5px sans-serif'
    ctx.fillText(l,22,y); ctx.fillText(v,158,y)
  }

  ctx.fillStyle='#d1d5d1'; ctx.fillRect(18,238,164,0.8)

  // total band
  const tg=ctx.createLinearGradient(18,242,182,262)
  tg.addColorStop(0,accent); tg.addColorStop(1,`${accent}cc`)
  ctx.fillStyle=tg; ctx.fillRect(18,242,164,20)
  ctx.fillStyle='#fff'; ctx.font='bold 8px sans-serif'
  ctx.fillText('TOTAL (incl. GST)',22,255); ctx.fillText('₹991.20',144,255)

  // paid stamp
  ctx.fillStyle='#dcfce7'; fillRR(ctx,56,268,88,18,9)
  ctx.strokeStyle='#22c55e'; ctx.lineWidth=0.8; rr(ctx,56,268,88,18,9); ctx.stroke()
  ctx.fillStyle='#15803d'; ctx.font='bold 7px sans-serif'
  ctx.fillText('✓  PAYMENT RECEIVED',63,280)

  ctx.fillStyle='#d1d5d1'; ctx.fillRect(18,292,164,0.8)

  // download btn
  const dg=ctx.createLinearGradient(18,298,182,320)
  dg.addColorStop(0,accent); dg.addColorStop(1,`${accent}bb`)
  ctx.fillStyle=dg; fillRR(ctx,18,298,164,22,8)
  ctx.fillStyle='#fff'; ctx.font='bold 8px sans-serif'; ctx.fillText('⬇  Download PDF Invoice',42,313)

  // share outline btn
  strokeFillRR(ctx,18,328,164,22,8,'#edf7ed',accent,0.8)
  ctx.fillStyle=accent; ctx.font='bold 7.5px sans-serif'; ctx.fillText('↗  Share with Accountant',42,343)

  ctx.fillStyle='#9ca3af'; ctx.font='5.5px sans-serif'
  ctx.fillText('System-generated invoice · CGST Act 2017',18,360)
  ctx.fillText('Valid for ITC claim. GST registered.',38,369)

  homeBar(ctx)
}

/* ─── screen dispatcher ───────────────────────────────── */
const DRAW_FNS = [drawChat, drawAI, drawVideo, drawProfile, drawWallet, drawInvoice]

function createScreenTexture(color: string, index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width  = 400   // 2x for sharpness
  canvas.height = 800
  const ctx = canvas.getContext('2d')!
  ctx.scale(2, 2)       // draw at 2x, displayed at 200×400
  const fn = DRAW_FNS[Math.min(index, DRAW_FNS.length - 1)]
  fn(ctx, color)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
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
          <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.25} />
        </RoundedBox>

        {/* Screen */}
        <RoundedBox args={[1.0, 2.0, 0.01]} radius={0.06} smoothness={4} position={[0, 0, 0.065]}>
          <meshStandardMaterial map={texture} />
        </RoundedBox>

        {/* Home bar */}
        <RoundedBox args={[0.28, 0.04, 0.01]} radius={0.02} smoothness={4} position={[0, -1.05, 0.07]}>
          <meshStandardMaterial color="#ffffff" opacity={0.45} transparent />
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
