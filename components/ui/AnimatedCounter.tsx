'use client'
import { useRef } from 'react'
import { useInView, useSpring, useTransform, motion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix: string
  label: string
}

export function AnimatedCounter({ value, suffix, label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const spring = useSpring(0, { stiffness: 60, damping: 20 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString('en-IN'))

  if (isInView) spring.set(value)

  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-extrabold text-5xl md:text-6xl text-white flex items-baseline justify-center gap-1">
        <motion.span>{display}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-white/80 text-base mt-2 font-medium">{label}</p>
    </div>
  )
}
