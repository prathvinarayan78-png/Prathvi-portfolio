import { Scene } from './components/canvas/Scene'
import { Preloader } from './components/ui/Preloader'
import { CursorProvider } from './components/ui/CustomCursor'
import { Navigation } from './components/ui/Navigation'
import { Hero } from './components/sections/Hero'
import { Showreel } from './components/sections/Showreel'
import { Works } from './components/sections/Works'
import { Studio } from './components/sections/Studio'
import { Footer } from './components/sections/Footer'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useAppStore } from './stores/useAppStore'

export default function App() {
  const loaded = useAppStore((s) => s.loaded)
  useSmoothScroll(loaded)

  return (
    <div className="grain">
      <Preloader />
      <CursorProvider />
      <Scene />
      <Navigation />
      <main>
        <Hero />
        <Showreel />
        <Works />
        <Studio />
        <Footer />
      </main>
    </div>
  )
}
