import gsap from 'gsap'

/* Single source of truth for day/night — the <body> class.
   Both toggles call this; any component can subscribe via observer. */

export function isDay() {
  return document.body.classList.contains('day')
}

export function setDay(next: boolean) {
  document.body.classList.toggle('day', next)
  localStorage.setItem('prathvi-day', next ? '1' : '0')
  gsap.fromTo('body', { rotate: next ? -0.5 : 0.5 }, { rotate: 0, duration: 0.45, ease: 'elastic.out(1,0.3)' })
}

export function toggleDay() {
  setDay(!isDay())
}

/* restore saved preference (call once on boot) */
export function initTheme() {
  document.body.classList.toggle('day', localStorage.getItem('prathvi-day') === '1')
}

/* subscribe to theme changes regardless of which button flipped it */
export function onThemeChange(cb: (day: boolean) => void) {
  const mo = new MutationObserver(() => cb(isDay()))
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  return () => mo.disconnect()
}
