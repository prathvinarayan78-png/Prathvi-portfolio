import { PageTransition } from '../components/ui/PageTransition'
import { Hero } from '../components/sections/Hero'
import { Ticker } from '../components/sections/Ticker'
import { Craft } from '../components/sections/Craft'
import { DesignGallery } from '../components/sections/DesignGallery'
import { WebGallery } from '../components/sections/WebGallery'
import { EditGallery } from '../components/sections/EditGallery'
import { Manifesto } from '../components/sections/Manifesto'
import { Showreel } from '../components/sections/Showreel'
import { HomeCta } from '../components/sections/HomeCta'

/* THE LONG SCROLL:
   hero → ticker → craft journey (pinned, 3 acts) →
   ACT I design gallery → ACT II website gallery → ACT III edit gallery →
   manifesto → showreel → ticker → CTA                              */

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Ticker items={['GRAPHIC DESIGN', 'WEBSITE BUILDING', 'VIDEO EDITING', 'BRAND IDENTITY', 'MOTION', 'AI AGENTS']} />
      <Craft />
      <DesignGallery />
      <Ticker reverse items={['PRINT & PIXELS', 'BUILT TO MOVE', 'CUT TO FEELING']} />
      <WebGallery />
      <EditGallery />
      <Manifesto />
      <Showreel />
      <Ticker items={['MAKING NOTHING ORDINARY', 'DELHI, IN', 'EST. 2026', 'ALWAYS SHIPPING']} />
      <HomeCta />
    </PageTransition>
  )
}
