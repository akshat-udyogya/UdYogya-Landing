'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { PlayStoreBadge } from '@/components/ui/PlayStoreBadge'
import { COPY } from '@/lib/constants'

const CTACanvas = dynamic(
  () => import('@/components/three/CTACanvas'),
  { ssr: false }
)

export default function DownloadCTA() {
  return (
    <section className="bg-background min-h-screen flex flex-col items-center justify-center py-24 px-8 md:px-16 text-center">
      {/* Glowing phone canvas */}
      <div
        className="w-64 h-96 mb-12 rounded-3xl animate-pulse-halo"
        aria-hidden="true"
      >
        <CTACanvas />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display font-medium text-4xl md:text-6xl text-white mb-6 display-tight"
      >
        {COPY.cta.headline}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-[rgba(255,255,255,0.72)] text-lg md:text-xl max-w-xl mb-10 tracking-[0.015em]"
      >
        {COPY.cta.sub}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <PlayStoreBadge size="lg" />
      </motion.div>

      <p className="mt-6 text-[rgba(255,255,255,0.45)] text-sm tracking-[0.015em]">{COPY.cta.fine}</p>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-[rgba(255,255,255,0.12)] w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-[rgba(255,255,255,0.5)] text-sm tracking-[0.015em]">
        <p>© 2026 Anarpakaya. All rights reserved.</p>
        <p>Udyogya — India&apos;s Expert Network</p>
      </div>
    </section>
  )
}
