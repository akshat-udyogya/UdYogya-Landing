'use client'
import { motion } from 'framer-motion'
import { WEB_APP_URL } from '@/lib/constants'

// Mock Hinglish chat demonstrating Ustaad diagnosing a conveyor belt fault
const MOCK_CHAT = [
  { role: 'user',   text: 'Mere conveyor belt ka motor baar baar trip ho raha hai, VFD pe E.OP.C error aa raha hai.' },
  { role: 'bot',    text: 'E.OP.C typically means output phase loss — motor ke ek phase ka connection weak ya cut ho gaya hai. Pehle motor terminal box check karo.' },
  { role: 'user',   text: 'Sab connections tight hain, phir bhi trip ho raha hai.' },
  { role: 'bot',    text: 'Achha. Drive ka output current unbalanced toh nahi? Drive menu mein U/V/W output current dekho. Agar ek phase significantly low hai toh winding issue possible hai.' },
  { role: 'user',   text: 'Haan W phase 0A dikh raha hai!' },
  { role: 'bot',    text: 'W phase ka winding open ho gayi hai ya drive ka output IGBT fail ho gaya hai. Dono common faults hain. Main recommend karta hoon ek VFD/motor specialist se live call lo.' },
]

export default function UstaadSection() {
  return (
    <section className="py-24 px-8 md:px-16 relative overflow-hidden" style={{ background: '#050A18' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(123,31,162,0.18) 0%, transparent 70%)',
      }} aria-hidden />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 50% 60% at 10% 60%, rgba(26,115,232,0.12) 0%, transparent 70%)',
      }} aria-hidden />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{ background: 'rgba(123,31,162,0.2)', border: '1px solid rgba(123,31,162,0.4)' }}>
            <img src="/assets/logo-icon.png" alt="Ustaad" width={22} height={22}
              style={{ borderRadius: 5, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#CE93D8',
              fontSize: 11, letterSpacing: '0.18em' }}>USTAAD — INDUSTRIAL AI ASSISTANT</span>
          </div>

          <h2 className="font-display font-medium text-4xl md:text-5xl text-white mb-6 display-tight">
            Diagnose Before You Book
          </h2>
          <p className="text-[rgba(255,255,255,0.6)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Ustaad asks the right questions, generates a fault checklist, and tells you exactly which expert to call —
            all for ₹3 per message. Save hours of guesswork.
          </p>
        </motion.div>

        {/* Two-column: mock chat + feature list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Mock chat */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#0D1526',
              border: '1px solid rgba(123,31,162,0.35)',
              boxShadow: '0 0 40px rgba(123,31,162,0.15)',
            }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(123,31,162,0.12)' }}>
              <img src="/assets/logo-icon.png" alt="Ustaad" width={32} height={32}
                style={{ borderRadius: 8, flexShrink: 0 }} />
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Ustaad</p>
                <p style={{ color: '#CE93D8', fontSize: 11, fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.1em' }}>● ONLINE · ₹3/message</p>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-3" style={{ minHeight: 340 }}>
              {MOCK_CHAT.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.2, duration: 0.4 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #1A73E8, #0D47A1)'
                      : 'rgba(255,255,255,0.07)',
                    border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input mock */}
            <div className="px-5 py-4 flex items-center gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 12,
                padding: '10px 14px', color: 'rgba(255,255,255,0.3)', fontSize: 13,
                border: '1px solid rgba(255,255,255,0.1)' }}>
                Describe your fault...
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #7B1FA2, #4A148C)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#fff', flexShrink: 0 }}>
                ➤
              </div>
            </div>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {[
              {
                icon: '🎯',
                title: 'Targeted Diagnostic Questions',
                desc: 'Ustaad asks focused questions one at a time — like a senior engineer would — not a generic FAQ form.',
              },
              {
                icon: '📋',
                title: 'Step-by-Step Fault Checklists',
                desc: 'Get a prioritized checklist of what to check, in what order. Resolve simple faults yourself; escalate complex ones.',
              },
              {
                icon: '👨‍🔧',
                title: 'Expert Recommendation',
                desc: 'When Ustaad determines you need a human, it instantly surfaces the right verified expert — by domain and availability.',
              },
              {
                icon: '🗣️',
                title: 'Hindi, English, Hinglish',
                desc: 'Chat in the language you think in. Ustaad responds in the same language you write in — no translation needed.',
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                className="flex items-start gap-5"
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(123,31,162,0.15)',
                  border: '1px solid rgba(123,31,162,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-white font-display font-semibold text-lg mb-1">{feat.title}</h3>
                  <p className="text-[rgba(255,255,255,0.55)] text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <a
                href={WEB_APP_URL + '/ustaad'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #7B1FA2, #4A148C)',
                  color: '#fff', padding: '14px 28px', borderRadius: 12,
                  fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  boxShadow: '0 0 32px rgba(123,31,162,0.35)',
                  transition: 'opacity .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <img src="/assets/logo-icon.png" alt="" width={20} height={20}
                  style={{ borderRadius: 5 }} />
                Try Ustaad AI Free →
              </a>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 10 }}>
                Available on Web App · ₹3 per message · First session free
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
