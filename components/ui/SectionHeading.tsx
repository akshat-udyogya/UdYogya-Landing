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
      <h2 className={`font-display font-bold text-4xl md:text-5xl mb-4 ${light ? 'text-surface' : 'text-white'}`}>
        {heading}
      </h2>
      {sub && (
        <p className={`text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-gray-600' : 'text-muted'}`}>
          {sub}
        </p>
      )}
    </motion.div>
  )
}
