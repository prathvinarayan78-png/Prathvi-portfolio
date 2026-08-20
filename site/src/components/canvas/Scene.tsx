import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { HeroSculpture } from './HeroSculpture'
import { FloatingObjects } from './FloatingObjects'
import { ParticleField } from './ParticleField'
import { ScrollCamera } from './ScrollCamera'

export function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: isMobile ? 62 : 50 }}
        dpr={isMobile ? [1, 1.4] : [1, 1.8]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 14, 46]} />

        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[4, 6, 4]} intensity={1.1} color="#dfe6ff" />
          <pointLight position={[-6, -2, 2]} intensity={18} color="#4488ff" />
          <pointLight position={[6, 3, -2]} intensity={10} color="#ffaa33" />

          <HeroSculpture />
          <FloatingObjects />
          <ParticleField count={isMobile ? 380 : 900} />
          <ScrollCamera />
          <Environment preset="city" />

          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.8} />
            <ChromaticAberration offset={[0.0012, 0.0008]} />
            <Vignette eskil={false} offset={0.18} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
