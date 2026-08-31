import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// mobile URL-bar show/hide fires resize storms — ignore height-only resizes
ScrollTrigger.config({ ignoreMobileResize: true })

// normalizeScroll ONLY on real touch devices — on desktop/iframes it
// hijacks native scrolling and can blank the whole page
if (ScrollTrigger.isTouch === 1) {
  ScrollTrigger.normalizeScroll({ allowNestedScroll: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
