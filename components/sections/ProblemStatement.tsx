'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COPY } from '@/lib/constants'
import { SectionHeading } from '@/components/ui/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export default function ProblemStatement() {
  const sectionRef    = useRef<HTMLElement | null>(null)
  const itemsRef      = useRef<(HTMLDivElement | null)[]>([])
  const dividerRef    = useRef<HTMLDivElement | null>(null)
  const resolutionRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !dividerRef.current || !resolutionRef.current) return
    const ctx = gsap.context(() => {
      // Pain points stagger in from left
      gsap.from(itemsRef.current.filter(Boolean), {
        x: -80,
        opacity: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      })

      // Divider line draws across
      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.8,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: dividerRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      // Resolution fades in
      gsap.from(resolutionRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: resolutionRef.current,
          start: 'top 85%',
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="problem" className="bg-background py-24 px-8 md:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <SectionHeading
            heading="The Problem"
            sub="Four reasons professionals struggle to get expert advice today"
          />
        </div>
        <div className="space-y-6 mb-12">
          {COPY.problem.pains.map((pain, i) => (
            <div
              key={i}
              ref={el => { itemsRef.current[i] = el }}
              className="flex items-start gap-4"
            >
              <span className="text-3xl mt-1 flex-shrink-0">❌</span>
              <p className="text-[rgba(255,255,255,0.72)] text-xl md:text-2xl font-medium leading-snug">
                "{pain}"
              </p>
            </div>
          ))}
        </div>

        <div
          ref={dividerRef}
          className="h-px mb-10"
          style={{ background: 'linear-gradient(90deg, #494fdf 0%, #4f55f1 100%)' }}
        />

        <p
          ref={resolutionRef}
          className="text-center text-2xl md:text-3xl font-display font-bold text-white"
        >
          {COPY.problem.resolution}
        </p>
      </div>
    </section>
  )
}
