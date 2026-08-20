import { Float } from '@react-three/drei'

/* Chrome / glass / emissive primitives orbiting the hero sculpture. */

const chrome = { metalness: 1, roughness: 0.08, color: '#c0c0c0' }
const dark = { metalness: 0.9, roughness: 0.25, color: '#2a2d33' }

export function FloatingObjects() {
  return (
    <group>
      <Float speed={1.6} rotationIntensity={1.2} floatIntensity={1.6}>
        <mesh position={[-4.4, 1.6, -2]}>
          <torusGeometry args={[0.8, 0.26, 24, 64]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={1.6} floatIntensity={1.2}>
        <mesh position={[4.6, -1.2, -3]} rotation={[0.4, 0.6, 0]}>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshPhysicalMaterial
            color="#0e1620"
            metalness={0.2}
            roughness={0.05}
            transmission={0.9}
            thickness={1.2}
            clearcoat={1}
          />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={0.8} floatIntensity={2}>
        <mesh position={[3.4, 2.4, -5]}>
          <sphereGeometry args={[0.55, 48, 48]} />
          <meshStandardMaterial
            emissive="#4488ff"
            emissiveIntensity={2.4}
            toneMapped={false}
            color="#0a0a0a"
          />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[-3.6, -2.2, -4]} rotation={[0.8, 0.2, 0.4]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial {...dark} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.4}>
        <mesh position={[-1.8, 3, -6]}>
          <torusKnotGeometry args={[0.45, 0.14, 96, 16]} />
          <meshStandardMaterial {...chrome} color="#8890a0" />
        </mesh>
      </Float>

      <Float speed={2.4} rotationIntensity={0.6} floatIntensity={2.4}>
        <mesh position={[1.6, -3, -3]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial
            emissive="#ffaa33"
            emissiveIntensity={2}
            toneMapped={false}
            color="#0a0a0a"
          />
        </mesh>
      </Float>
    </group>
  )
}
