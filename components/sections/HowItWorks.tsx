'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WebAppBadge }    from '@/components/ui/WebAppBadge'
import { PlayStoreBadge } from '@/components/ui/PlayStoreBadge'
import { COPY } from '@/lib/constants'

const STEP_ICONS = ['🔍', '💬', '✅']

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0D1526] py-24 px-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          heading="How It Works"
          sub="Get expert help in three simple steps"
        />

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-0">
          {COPY.howItWorks.map((item, i) => (
            <React.Fragment key={item.step}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center text-center px-8 max-w-xs"
              >
                {/* Number badge */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl mb-4"
                  style={{
                    background: '#494fdf',
                    boxShadow: '0 4px 20px rgba(73,79,223,0.35)',
                  }}
                >
                  {item.step}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">{STEP_ICONS[i]}</div>

                <h3 className="font-display font-medium text-xl text-white mb-3 display-md-tight">{item.title}</h3>
                <p className="text-[rgba(255,255,255,0.6)] text-base leading-relaxed">{item.desc}</p>
              </motion.div>

              {/* Connector arrow between steps */}
              {i < 2 && (
                <div className="hidden md:flex items-center text-[#494fdf] text-3xl px-2 flex-shrink-0" aria-hidden="true">
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <p className="text-[rgba(255,255,255,0.55)] text-sm font-medium">Ready to get started?</p>
          <WebAppBadge size="sm" variant="dark" label="Open Web App" />
          <PlayStoreBadge size="sm" />
        </motion.div>
      </div>
    </section>
  )
}
