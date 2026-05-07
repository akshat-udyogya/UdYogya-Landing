import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { COPY } from '@/lib/constants'

export default function Stats() {
  return (
    <section
      className="py-24 px-8 md:px-16"
      style={{ background: 'linear-gradient(135deg, #1A73E8 0%, #FF6B35 100%)' }}
      aria-label="Udyogya statistics"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {COPY.stats.map((stat) => (
          <AnimatedCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  )
}
