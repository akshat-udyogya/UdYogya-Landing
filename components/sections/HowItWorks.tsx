'use client'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { COPY } from '@/lib/constants'

const STEP_ICONS = ['🔍', '💬', '✅']

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surfaceLight py-24 px-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          heading="How It Works"
          sub="Get expert help in three simple steps"
          light
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {COPY.howItWorks.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center text-center"
            >
              {/* Number badge */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl mb-4"
                style={{
                  background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
                  boxShadow: '0 0 20px rgba(26,115,232,0.4)',
                }}
              >
                {item.step}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{STEP_ICONS[i]}</div>

              <h3 className="font-display font-bold text-xl text-surface mb-3">{item.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
