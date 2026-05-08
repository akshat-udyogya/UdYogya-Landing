'use client'
import { motion } from 'framer-motion'

interface SectionHeadingProps {
  heading: string
  sub?: string
  light?: boolean
  center?: boolean
}

export function SectionHeading({ heading, sub, light = false, center = true }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={center ? 'text-center' : ''}
    >
      {/* Revolut: display weight 500, tight -0.01em letter-spacing, lineHeight 1.19–1.21 */}
      <h2
        className={`font-display font-medium text-4xl md:text-5xl mb-4 display-md-tight ${
          light ? 'text-ink' : 'text-white'
        }`}
      >
        {heading}
      </h2>
      {sub && (
        <p
          className={`text-lg max-w-2xl leading-relaxed ${center ? 'mx-auto' : ''} ${
            light ? 'text-[#505a63]' : 'text-[rgba(255,255,255,0.72)]'
          }`}
        >
          {sub}
        </p>
      )}
    </motion.div>
  )
}
