import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { WebAppBadge }    from '@/components/ui/WebAppBadge'
import { PlayStoreBadge } from '@/components/ui/PlayStoreBadge'
import { COPY } from '@/lib/constants'

export default function Stats() {
  return (
    <section
      className="py-24 px-8 md:px-16"
      style={{ background: '#494fdf' }}
      aria-label="Udyogya statistics"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-14">
        {COPY.stats.map((stat) => (
          <AnimatedCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <WebAppBadge size="lg" variant="white" label="Open Web App" />
        <PlayStoreBadge size="lg" />
      </div>
    </section>
  )
}
