"use client"

import { useRef } from "react"
import { Center } from "@react-three/drei"

export function FallbackCar({ color = "#240046" }) {
  const group = useRef()

  return (
    <Center>
      <group ref={group} scale={1} position={[0, 0, 0]}>
        {/* Car body */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[4, 1, 2]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Car cabin */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[2, 0.7, 1.8]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Wheels */}
        <mesh position={[1.5, 0, 1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
        </mesh>
        <mesh position={[1.5, 0, -1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
        </mesh>
        <mesh position={[-1.5, 0, 1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
        </mesh>
        <mesh position={[-1.5, 0, -1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="black" metalness={0.5} roughness={0.7} />
        </mesh>

        {/* Windshield */}
        <mesh position={[0.5, 1.1, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <boxGeometry args={[0.1, 0.7, 1.7]} />
          <meshStandardMaterial color="#aaddff" transparent opacity={0.7} metalness={0.2} roughness={0.1} />
        </mesh>

        {/* Headlights */}
        <mesh position={[2, 0.7, 0.7]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.3]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[2, 0.7, -0.7]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.3]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>

        {/* Taillights */}
        <mesh position={[-2, 0.7, 0.7]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.3]} />
          <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-2, 0.7, -0.7]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.3]} />
          <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Center>
  )
} 