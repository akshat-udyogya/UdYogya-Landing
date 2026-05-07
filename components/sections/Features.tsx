'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FEATURES } from '@/lib/constants'

const FeaturesCanvas = dynamic(
  () => import('@/components/three/FeaturesCanvas'),
  { ssr: false }
)

export default function Features() {
  const [activeScreen, setActiveScreen] = useState(FEATURES[0].screen)

  return (
    <section id="features" className="bg-background py-24 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          heading="Everything You Need"
          sub="Six powerful features. One simple app."
        />

        <div className="mt-16 flex flex-col md:flex-row gap-12 items-start">
          {/* Sticky phone — left column */}
          <div className="w-full md:w-1/2 md:sticky md:top-24 h-[420px]" aria-hidden="true">
            <FeaturesCanvas screenSrc={activeScreen} />
          </div>

          {/* Feature cards — right column */}
          <div className="w-full md:w-1/2 space-y-8">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: '-30%' }}
                onViewportEnter={() => setActiveScreen(feat.screen)}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="p-6 rounded-2xl border border-white/10 bg-surface hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0">{feat.icon}</span>
                  <div>
                    <h3 className="font-display font-bold text-white text-xl mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-muted leading-relaxed">{feat.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
