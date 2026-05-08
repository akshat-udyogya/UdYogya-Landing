import Hero             from '@/components/sections/Hero'
import ProblemStatement from '@/components/sections/ProblemStatement'
import HowItWorks       from '@/components/sections/HowItWorks'
import Features         from '@/components/sections/Features'
import ExpertSpotlight  from '@/components/sections/ExpertSpotlight'
import Testimonials     from '@/components/sections/Testimonials'
import Stats            from '@/components/sections/Stats'
import DownloadCTA      from '@/components/sections/DownloadCTA'

export default function Page() {
  return (
    <main>
      <Hero />
      <ProblemStatement />
      <HowItWorks />
      <Features />
      <ExpertSpotlight />
      <Testimonials />
      <Stats />
      <DownloadCTA />
    </main>
  )
}
