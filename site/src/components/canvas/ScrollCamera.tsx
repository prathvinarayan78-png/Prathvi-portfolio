import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* Camera dollies forward + drifts as the page scrolls; objects part away. */

export function ScrollCamera() {
  const { camera } = useThree()
  const scroll = useRef(0)

  useFrame(({ pointer }) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = max > 0 ? window.scrollY / max : 0
    scroll.current += (target - scroll.current) * 0.06

    const p = scroll.current
    camera.position.z = THREE.MathUtils.lerp(10, 3.2, p)
    camera.position.y = THREE.MathUtils.lerp(0, -1.4, p)
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.04
    camera.lookAt(0, 0, -6)
    camera.rotation.z = p * 0.06
  })

  return null
}
