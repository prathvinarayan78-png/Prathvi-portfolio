import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// exposed so ScrollToTop & anchors can drive the same instance
export let lenis: Lenis | null = null

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    lenis = new Lenis({
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 4), // quart-out: glassy glide
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.6,
      lerp: 0.09,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis!.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])
}
