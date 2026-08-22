import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* Frame-rate-independent damped camera — identical feel at 30/60/144hz. */

export function ScrollCamera() {
  const { camera } = useThree()
  const scroll = useRef(0)

  useFrame(({ pointer }, delta) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = max > 0 ? window.scrollY / max : 0

    // exponential damping (not per-frame lerp) → butter at any refresh rate
    scroll.current = THREE.MathUtils.damp(scroll.current, target, 3.2, delta)
    const p = scroll.current

    camera.position.z = THREE.MathUtils.lerp(10, 3.2, p)
    camera.position.y = THREE.MathUtils.lerp(0, -1.4, p)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.9, 2.6, delta)
    camera.lookAt(0, 0, -6)
    camera.rotation.z = p * 0.06
  })

  return null
}
