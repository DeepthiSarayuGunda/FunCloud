import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function FloatingBox() {
  const ref = React.useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.6
    ref.current.position.y = Math.sin(t) * 0.35
  })
  return (
    <mesh ref={ref} position={[0,0,0]}>
      <boxGeometry args={[1.2,1.2,1.2]} />
      <meshStandardMaterial color={'#60a5fa'} roughness={0.3} metalness={0.2} />
    </mesh>
  )
}

export default function ThreeHero() {
  return (
    <div className="w-full h-56 rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5,5,5]} intensity={0.6} />
        <FloatingBox />
      </Canvas>
    </div>
  )
}
