import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// mobile URL-bar show/hide fires resize storms — ignore height-only resizes
ScrollTrigger.config({ ignoreMobileResize: true })
// normalizeScroll stabilizes pinning on touch devices
ScrollTrigger.normalizeScroll({ allowNestedScroll: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
