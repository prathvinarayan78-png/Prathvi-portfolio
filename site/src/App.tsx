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

/* BRUTAL — EXTRA LONG EDITION. 16 sections of loud.
   Click anywhere to stamp it. */

export default function App() {
  return (
    <div id="top" className="noise relative">
      <StampLayer />
      <Progress />
      <SideNav />
      <Nav />

      <Hero />
      <Marquee items={['GRAPHIC DESIGN', 'WEB BUILDS', 'VIDEO EDITS', 'NO TEMPLATES', 'ALL KILLER']} />
      <WorkGrid />
      <ScrollRail />
      <Manifesto />

      <div id="process"><Process /></div>
      <div id="services"><Services /></div>
      <Stats />
      <Alphabet />

      <div id="lab"><Lab /></div>
      <Meanwhile />
      <Reviews />

      <Marquee reverse items={['SCROLL FASTER', 'HOVER EVERYTHING', 'CLICK EVERYTHING']} speed={22} />
      <div id="faq"><Faq /></div>
      <Footer />
    </div>
  )
}
