'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { PlayStoreBadge } from '@/components/ui/PlayStoreBadge'
import { COPY, PLAY_STORE_URL } from '@/lib/constants'

// Dynamic import wraps the entire Canvas + R3F scene so next/dynamic mock
// suppresses all Three.js code in jsdom test environments.
const HeroCanvas = dynamic(
  () => import('@/components/three/HeroCanvas'),
  { ssr: false }
)

const WORDS = COPY.hero.headline.split(' ')

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col bg-background overflow-hidden"
    >
      {/* 3D Canvas — absolute background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <HeroCanvas />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        aria-label="Main navigation"
        className="relative z-10 flex items-center justify-between px-8 pt-6"
      >
        <Image src="/assets/logo.png" alt="Udyogya" width={140} height={40} priority />
        <div className="hidden md:flex items-center gap-8 text-[rgba(255,255,255,0.72)] font-medium text-sm tracking-[0.015em]">
          <a href="#features"     className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <Button
            href={PLAY_STORE_URL}
            variant="primary"
            className="text-sm"
            ariaLabel="Get the Udyogya app on Google Play"
          >
            Download
          </Button>
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="px-8 md:px-16 max-w-2xl">
          <h1 className="font-display font-medium text-5xl md:text-7xl text-white mb-6 display-tight">
            {/* Screen-reader accessible full text */}
            <span className="sr-only">{COPY.hero.headline}</span>
            {/* Visually animated word-by-word spans */}
            <span aria-hidden="true">
              {WORDS.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-[rgba(255,255,255,0.72)] text-lg md:text-xl mb-10 leading-relaxed tracking-[0.015em]"
          >
            {COPY.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <PlayStoreBadge size="lg" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="relative z-10 flex justify-center pb-8"
        aria-hidden="true"
      >
        <motion.span
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-muted text-2xl"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  )
}
