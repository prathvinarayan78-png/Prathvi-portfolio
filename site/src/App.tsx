import { Nav } from './brutal/Nav'
import { Hero } from './brutal/Hero'
import { Marquee } from './brutal/Marquee'
import { Manifesto } from './brutal/Manifesto'
import { WorkGrid } from './brutal/WorkGrid'
import { Services } from './brutal/Services'
import { Footer } from './brutal/Footer'
import { StampLayer } from './brutal/StampLayer'
import { Progress } from './brutal/Progress'
import { ScrollRail } from './brutal/ScrollRail'
import { Process } from './brutal/Process'
import { Stats } from './brutal/Stats'

/* BRUTAL, LONG EDITION:
   hero → marquee → work table → rail (pinned scrub) → manifesto →
   process (pinned cards) → services → stats (scrub counters) →
   marquee → footer. Click anywhere to stamp it. */

export default function App() {
  return (
    <div id="top" className="noise relative">
      <StampLayer />
      <Progress />
      <Nav />
      <Hero />
      <Marquee items={['GRAPHIC DESIGN', 'WEB BUILDS', 'VIDEO EDITS', 'NO TEMPLATES', 'ALL KILLER']} />
      <WorkGrid />
      <ScrollRail />
      <Manifesto />
      <Process />
      <Services />
      <Stats />
      <Marquee reverse items={['SCROLL FASTER', 'HOVER EVERYTHING', 'CLICK EVERYTHING']} speed={22} />
      <Footer />
    </div>
  )
}
