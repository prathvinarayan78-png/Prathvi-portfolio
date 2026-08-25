import { PageTransition } from '../components/ui/PageTransition'
import { Hero } from '../components/sections/Hero'
import { Ticker } from '../components/sections/Ticker'
import { Craft } from '../components/sections/Craft'
import { Manifesto } from '../components/sections/Manifesto'
import { Showreel } from '../components/sections/Showreel'
import { WorksPreview } from '../components/sections/WorksPreview'
import { HomeCta } from '../components/sections/HomeCta'

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Ticker items={['GRAPHIC DESIGN', 'VIDEO EDIT', 'AI AGENTS', 'BRAND IDENTITY', 'MOTION', 'AUTOMATION']} />
      <Craft />
      <Manifesto />
      <Showreel />
      <Ticker reverse items={['MAKING NOTHING ORDINARY', 'DELHI, IN', 'EST. 2026', 'ALWAYS SHIPPING']} />
      <WorksPreview />
      <HomeCta />
    </PageTransition>
  )
}
