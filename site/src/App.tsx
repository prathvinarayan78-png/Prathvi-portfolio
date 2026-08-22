import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Scene } from './components/canvas/Scene'
import { Preloader } from './components/ui/Preloader'
import { CursorProvider } from './components/ui/CustomCursor'
import { Navigation } from './components/ui/Navigation'
import { Footer } from './components/sections/Footer'
import Home from './pages/Home'
import WorksPage from './pages/WorksPage'
import StudioPage from './pages/StudioPage'
import ContactPage from './pages/ContactPage'
import { useSmoothScroll, lenis } from './hooks/useSmoothScroll'
import { useAppStore } from './stores/useAppStore'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // jump via Lenis so the smoother's internal state stays in sync
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const loaded = useAppStore((s) => s.loaded)
  useSmoothScroll(loaded)

  return (
    <BrowserRouter>
      <div className="grain">
        <Preloader />
        <CursorProvider />
        <Scene />
        <Navigation />
        <ScrollToTop />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
