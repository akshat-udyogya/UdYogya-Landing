import DigitalTwinHero   from '@/components/sections/DigitalTwinHero'
import ProblemStatement   from '@/components/sections/ProblemStatement'
import HowItWorks         from '@/components/sections/HowItWorks'
import Features           from '@/components/sections/Features'
import UstaadSection      from '@/components/sections/UstaadSection'
import ExpertSpotlight    from '@/components/sections/ExpertSpotlight'
import Testimonials       from '@/components/sections/Testimonials'
import Stats              from '@/components/sections/Stats'
import Solutions          from '@/components/sections/Solutions'
import DownloadCTA        from '@/components/sections/DownloadCTA'

export default function Page() {
  return (
    <main>
      <DigitalTwinHero />
      <ProblemStatement />
      <HowItWorks />
      <Features />
      <UstaadSection />
      <ExpertSpotlight />
      <Testimonials />
      <Stats />
      <Solutions />
      <DownloadCTA />
    </main>
  )
}
