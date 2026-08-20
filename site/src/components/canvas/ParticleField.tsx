import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Custom shader particle field with noise displacement — depth backdrop. */

const vertex = /* glsl */ `
uniform float uTime;
attribute float aScale;
attribute float aPhase;
varying float vAlpha;

void main(){
  vec3 pos = position;
  pos.y += sin(uTime * 0.3 + aPhase) * 0.6;
  pos.x += cos(uTime * 0.2 + aPhase * 2.0) * 0.4;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * (34.0 / -mv.z);
  vAlpha = smoothstep(-46.0, -6.0, mv.z) * 0.75;
}
`

const fragment = /* glsl */ `
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float glow = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(0.55, 0.7, 1.0), glow * vAlpha);
}
`

export function ParticleField({ count = 900 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!)

  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26
      positions[i * 3 + 2] = -4 - Math.random() * 38
      scales[i] = 0.6 + Math.random() * 2.2
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, scales, phases }
  }, [count])

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
