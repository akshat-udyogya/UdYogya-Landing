import { SectionHeading } from '@/components/ui/SectionHeading'
import { TESTIMONIALS } from '@/lib/constants'

type Testimonial = typeof TESTIMONIALS[number]

function TestimonialCard({ quote, name, role, city }: Testimonial) {
  return (
    <div
      className="flex-shrink-0 w-72 p-6 rounded-[20px] bg-[#16181a] border border-[rgba(255,255,255,0.12)]"
      style={{ boxShadow: '0 4px 24px rgba(73,79,223,0.12)' }}
    >
      <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
      <p className="text-[rgba(255,255,255,0.72)] text-sm leading-relaxed tracking-[0.015em] mb-4">"{quote}"</p>
      <div>
        <p className="text-white font-semibold text-sm">{name}</p>
        <p className="text-[rgba(255,255,255,0.5)] text-xs tracking-[0.015em]">
          {role} · {city}
        </p>
      </div>
    </div>
  )
}

const ROW_ONE = TESTIMONIALS.slice(0, 6)
const ROW_TWO = TESTIMONIALS.slice(6, 12)

export default function Testimonials() {
  return (
    <section className="bg-background py-24 overflow-hidden">
      <div className="px-8 md:px-16 mb-12">
        <SectionHeading
          heading="What People Are Saying"
          sub="Real results from real professionals across India"
        />
      </div>

      {/* Row 1 — scrolls left */}
      <div
        className="flex gap-6 w-max animate-marquee-left mb-6 hover:[animation-play-state:paused]"
        aria-label="Customer testimonials row 1"
      >
        {[...ROW_ONE, ...ROW_ONE].map((t, i) => (
          <TestimonialCard key={`row1-${i}`} {...t} />
        ))}
      </div>

      {/* Row 2 — scrolls right */}
      <div
        className="flex gap-6 w-max animate-marquee-right hover:[animation-play-state:paused]"
        aria-label="Customer testimonials row 2"
      >
        {[...ROW_TWO, ...ROW_TWO].map((t, i) => (
          <TestimonialCard key={`row2-${i}`} {...t} />
        ))}
      </div>
    </section>
  )
}
