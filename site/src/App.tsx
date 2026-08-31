import { useState } from 'react'
import { Loader } from './brutal/Loader'
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
import { Alphabet } from './brutal/Alphabet'
import { Lab } from './brutal/Lab'
import { Reviews } from './brutal/Reviews'
import { Faq } from './brutal/Faq'
import { Meanwhile } from './brutal/Meanwhile'
import { SideNav } from './brutal/SideNav'
import { DayToggle } from './brutal/DayToggle'
import { Timeline } from './brutal/Timeline'
import { StickyStack } from './brutal/StickyStack'
import { ZoomPunch } from './brutal/ZoomPunch'
import { Orbit } from './brutal/Orbit'

/* BRUTAL — MAXIMUM LENGTH EDITION. 20 sections.
   Click anywhere to stamp. ☀ bottom-left for day mode. */

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <div id="top" className="noise relative">
      <Loader onDone={() => setReady(true)} />
      <StampLayer />
      <Progress />
      <SideNav />
      <DayToggle />
      <Nav />

      <Hero ready={ready} />
      <Marquee items={['GRAPHIC DESIGN', 'WEB BUILDS', 'VIDEO EDITS', 'NO TEMPLATES', 'ALL KILLER']} />
      <WorkGrid />
      <ScrollRail />
      <Manifesto />

      <div id="process"><Process /></div>
      <StickyStack />
      <div id="services"><Services /></div>
      <Stats />
      <Timeline />
      <Alphabet />
      <Orbit />

      <div id="lab"><Lab /></div>
      <Meanwhile />
      <Reviews />
      <ZoomPunch />

      <Marquee reverse items={['SCROLL FASTER', 'HOVER EVERYTHING', 'CLICK EVERYTHING']} speed={22} />
      <div id="faq"><Faq /></div>
      <Footer />
    </div>
  )
}
