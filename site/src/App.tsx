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
import { Desk } from './brutal/Desk'
import { Status } from './brutal/Status'
import { BrainSplit } from './brutal/BrainSplit'
import { BeforeAfter } from './brutal/BeforeAfter'
import { Timeline } from './brutal/Timeline'
import { StickyStack } from './brutal/StickyStack'
import { ZoomPunch } from './brutal/ZoomPunch'
import { Orbit } from './brutal/Orbit'
import { Gap } from './brutal/Gap'
import { Backdrop } from './brutal/Backdrop'
import { Trail } from './brutal/Trail'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* BRUTAL — MAXIMUM LENGTH EDITION. 20 sections.
   Click anywhere to stamp. ☀ bottom-left for day mode. */

export default function App() {
  const [ready, setReady] = useState(false)

  // wipe-in section titles when they enter (GSAP — same pattern as all
  // other reveals; titles are visible by default if JS/observer fails)
  useEffect(() => {
    const triggers: ScrollTrigger[] = []
    document.querySelectorAll<HTMLElement>('[data-wipe]').forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        },
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <div id="top" className="noise vignette relative">
      <Loader onDone={() => setReady(true)} />
      <Backdrop />
      <StampLayer />
      <Trail />
      <Progress />
      <SideNav />
      <DayToggle />
      <Nav />

      <div className="relative z-10">
      <Hero ready={ready} />
      <Marquee items={['GRAPHIC DESIGN', 'WEB BUILDS', 'VIDEO EDITS', 'NO TEMPLATES', 'ALL KILLER']} />
      <Gap />
      <WorkGrid />
      <Gap />
      <Desk />
      <Gap size="sm" />
      <ScrollRail />
      <Gap size="sm" />
      <Manifesto />
      <Gap />

      <div id="process"><Process /></div>
      <Gap />
      <StickyStack />
      <Gap />
      <div id="services"><Services /></div>
      <Gap />
      <BrainSplit />
      <Gap size="sm" />
      <Stats />
      <Gap />
      <div id="road"><Timeline /></div>
      <Gap />
      <BeforeAfter />
      <Gap />
      <Alphabet />
      <Gap />
      <Orbit />
      <Gap />

      <div id="lab"><Lab /></div>
      <Gap />
      <Meanwhile />
      <Gap />
      <Reviews />
      <Gap />
      <ZoomPunch />
      <Gap />
      <Status />
      <Gap size="sm" />
      <Marquee reverse items={['SCROLL FASTER', 'HOVER EVERYTHING', 'CLICK EVERYTHING']} speed={22} />
      <Gap />
      <div id="faq"><Faq /></div>
      <Gap />
      <Footer />
      </div>
    </div>
  )
}
