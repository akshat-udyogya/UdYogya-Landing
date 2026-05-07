'use client'
import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EXPERTS } from '@/lib/constants'

type Expert = typeof EXPERTS[number]

function ExpertCard({ expert }: { expert: Expert }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -8
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 8
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform =
      'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  const initials = expert.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-64 p-6 rounded-2xl bg-background border border-white/10 transition-transform duration-200 ease-out cursor-default"
    >
      {/* Gradient avatar */}
      <div
        className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-white font-display font-bold text-xl"
        style={{
          background: `linear-gradient(135deg, ${expert.gradient[0]}, ${expert.gradient[1]})`,
        }}
        aria-hidden="true"
      >
        {initials}
      </div>

      <h3 className="font-display font-bold text-white text-lg">{expert.name}</h3>

      <span className="inline-block mt-1 mb-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
        {expert.role}
      </span>

      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="text-yellow-400" aria-hidden="true">★</span>
        <span className="text-white font-semibold">{expert.rating}</span>
        <span>· {expert.consultations} consultations</span>
      </div>
    </div>
  )
}

export default function ExpertSpotlight() {
  const controls = useAnimationControls()

  const handleMouseEnter = () => {
    controls.stop()
  }

  const handleMouseLeave = () => {
    void controls.start({
      x: [null, '-50%'],
      transition: { duration: 30, repeat: Infinity, ease: 'linear' },
    })
  }

  return (
    <section className="bg-surface py-24 overflow-hidden">
      <div className="px-8 md:px-16 mb-12">
        <SectionHeading
          heading="Meet the Experts Behind the Answers"
          sub="Verified professionals across 25+ categories"
        />
      </div>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-6 w-max"
          animate={controls}
          initial={{ x: '0%' }}
          onViewportEnter={() =>
            void controls.start({
              x: [null, '-50%'],
              transition: { duration: 30, repeat: Infinity, ease: 'linear' },
            })
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {[...EXPERTS, ...EXPERTS].map((expert, i) => (
            <ExpertCard key={`${expert.name}-${i}`} expert={expert} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
