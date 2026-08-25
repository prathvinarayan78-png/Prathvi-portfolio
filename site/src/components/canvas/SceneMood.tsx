import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Scene mood — the two rig lights journey through the page acts:
   blue (design) → amber (edit) → chrome (agents) as you scroll. */

const STOPS_A = [new THREE.Color('#4488ff'), new THREE.Color('#ffaa33'), new THREE.Color('#c0c0c0')]
const STOPS_B = [new THREE.Color('#ffaa33'), new THREE.Color('#4488ff'), new THREE.Color('#8899ff')]

function sample(stops: THREE.Color[], t: number, out: THREE.Color) {
  const seg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)))
  const local = t * (stops.length - 1) - seg
  out.lerpColors(stops[seg], stops[seg + 1], THREE.MathUtils.clamp(local, 0, 1))
}

export function SceneMood() {
  const lightA = useRef<THREE.PointLight>(null!)
  const lightB = useRef<THREE.PointLight>(null!)
  const p = useRef(0)
  const cA = useRef(new THREE.Color())
  const cB = useRef(new THREE.Color())

  useFrame((_, delta) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = max > 0 ? window.scrollY / max : 0
    p.current = THREE.MathUtils.damp(p.current, target, 2.5, delta)

    sample(STOPS_A, p.current, cA.current)
    sample(STOPS_B, p.current, cB.current)
    lightA.current.color.copy(cA.current)
    lightB.current.color.copy(cB.current)

    // lights orbit slowly for living shadows
    const t = performance.now() / 1000
    lightA.current.position.x = -6 + Math.sin(t * 0.3) * 2
    lightB.current.position.y = 3 + Math.cos(t * 0.24) * 1.5
  })

  return (
    <>
      <pointLight ref={lightA} position={[-6, -2, 2]} intensity={18} />
      <pointLight ref={lightB} position={[6, 3, -2]} intensity={10} />
    </>
  )
}
