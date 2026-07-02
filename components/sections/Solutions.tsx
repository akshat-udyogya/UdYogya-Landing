'use client'
import { motion } from 'framer-motion'

const SOLUTIONS = [
  {
    icon: '🧑‍💼',
    title: 'Expert Platform',
    description: 'Connect with verified industrial experts — PLC engineers, hydraulics specialists, GST consultants and more. Pay only for the help you need.',
    url: 'https://expert.udyogya.com',
    live: true,
    cta: 'Launch App',
  },
  {
    icon: '🏭',
    title: 'ERP Solution',
    description: 'End-to-end enterprise resource planning built for Indian MSMEs. Manage inventory, production, finance and compliance in one place.',
    url: null,
    live: false,
    cta: 'Coming Soon',
  },
  {
    icon: '🛒',
    title: 'Purchase Management',
    description: 'Streamline procurement, vendor management and purchase orders. Cut costs and eliminate manual paperwork across your supply chain.',
    url: null,
    live: false,
    cta: 'Coming Soon',
  },
]

export default function Solutions() {
  return (
    <section className="bg-background py-24 px-8 md:px-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-cyan-400 text-sm font-mono tracking-[0.2em] uppercase mb-4">
          Our Solutions
        </p>
        <h2 className="font-display font-medium text-4xl md:text-5xl text-white display-tight">
          One Platform,<br />
          <span className="text-cyan-400">Every Business Need</span>
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] text-lg mt-6 max-w-xl mx-auto">
          Udyogya is building a suite of tools to help Indian MSMEs grow, operate efficiently and compete globally.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {SOLUTIONS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className={`relative rounded-2xl p-8 flex flex-col border ${
              s.live
                ? 'border-cyan-500/40 bg-[rgba(0,255,255,0.04)]'
                : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]'
            }`}
          >
            {s.live && (
              <span className="absolute top-4 right-4 text-xs font-mono text-cyan-400 border border-cyan-500/40 rounded-full px-3 py-1">
                Live
              </span>
            )}

            <div className="text-4xl mb-5">{s.icon}</div>

            <h3 className="text-white font-display font-medium text-xl mb-3">
              {s.title}
            </h3>

            <p className="text-[rgba(255,255,255,0.55)] text-sm leading-relaxed flex-1">
              {s.description}
            </p>

            <div className="mt-8">
              {s.live ? (
                <a
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                >
                  {s.cta} →
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.3)] text-sm border border-[rgba(255,255,255,0.12)] px-6 py-3 rounded-xl">
                  {s.cta}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
