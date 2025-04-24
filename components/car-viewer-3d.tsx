"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Stage, ContactShadows } from "@react-three/drei"
import { Mesh, Color, MeshStandardMaterial, type Group, Object3D } from "three"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

// Define types for the GLTF nodes
interface CustomNode {
  geometry?: any;
  material?: any;
}

interface GLTFResult {
  nodes: Record<string, Object3D & CustomNode>;
  materials: Record<string, any>;
}

// Car model component
function CarModel({ color, ...props }: { color: string; [key: string]: any }) {
  const group = useRef<Group>(null)
  // Load the car2.glb model from the public/models directory
  const { nodes, materials } = useGLTF("/models/car2.glb") as GLTFResult

  // Apply color to the model
  useEffect(() => {
    if (group.current) {
      group.current.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
          child.material.color = new Color(color)
          child.material.needsUpdate = true
        }
      })
    }
  }, [color])

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Render the car model - note that node and material names may need to be adjusted based on the actual car2.glb structure */}
      {Object.keys(nodes).map((nodeName) => {
        // Skip non-mesh nodes or nodes without geometry
        if (!nodes[nodeName].geometry) return null;
        
        return (
          <mesh
            key={nodeName}
            name={nodeName}
            castShadow
            receiveShadow
            geometry={nodes[nodeName].geometry}
            material={nodes[nodeName].material}
            position={nodes[nodeName].position}
            rotation={nodes[nodeName].rotation}
            scale={nodes[nodeName].scale}
          />
        );
      })}
    </group>
  )
}

// Camera controls with auto-rotation
interface CameraControlsProps {
  autoRotate: boolean;
  resetView: boolean;
}

function CameraControls({ autoRotate, resetView }: CameraControlsProps) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (resetView && controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [resetView])

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={autoRotate}
      autoRotateSpeed={1}
      enableZoom={true}
      enablePan={false}
      minDistance={3}
      maxDistance={10}
      target={[0, 0, 0]}
    />
  )
}

// Preset view positions
const viewPositions = {
  front: { position: [0, 0, 5], rotation: [0, 0, 0] },
  side: { position: [5, 0, 0], rotation: [0, Math.PI / 2, 0] },
  rear: { position: [0, 0, -5], rotation: [0, Math.PI, 0] },
  top: { position: [0, 5, 0], rotation: [Math.PI / 2, 0, 0] },
}

type ViewType = 'front' | 'side' | 'rear' | 'top';

interface CarViewer3DProps {
  color?: string;
  currentView?: ViewType;
  onViewChange?: (view: ViewType) => void;
}

export default function CarViewer3D({ color = "#CFB53B", currentView = "side", onViewChange = (view) => {} }: CarViewer3DProps) {
  const [autoRotate, setAutoRotate] = useState(false)
  const [resetView, setResetView] = useState(false)

  // Handle view change
  const handleViewChange = (view: ViewType) => {
    onViewChange(view)
    setResetView(true)
    setTimeout(() => setResetView(false), 100)
  }

  // Preload the car model
  useGLTF.preload("/models/car2.glb")

  return (
    <div className="relative w-full h-full">
      <Canvas shadows dpr={[1, 2]} className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <CameraControls autoRotate={autoRotate} resetView={resetView} />

        {/* Environment and lighting */}
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        {/* Car model with stage */}
        <Stage environment="sunset" intensity={0.5} shadows>
          <CarModel color={color} position={[0, -1, 0]} />
        </Stage>

        {/* Ground with shadow */}
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          variant={currentView === "front" ? "default" : "outline"}
          onClick={() => handleViewChange("front")}
          className="bg-gray-800 hover:bg-gray-700"
        >
          Front
        </Button>
        <Button
          variant={currentView === "side" ? "default" : "outline"}
          onClick={() => handleViewChange("side")}
          className="bg-gray-800 hover:bg-gray-700"
        >
          Side
        </Button>
        <Button
          variant={currentView === "rear" ? "default" : "outline"}
          onClick={() => handleViewChange("rear")}
          className="bg-gray-800 hover:bg-gray-700"
        >
          Rear
        </Button>
        <Button
          variant={currentView === "top" ? "default" : "outline"}
          onClick={() => handleViewChange("top")}
          className="bg-gray-800 hover:bg-gray-700"
        >
          Top
        </Button>
      </div>

      {/* Auto-rotate toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant={autoRotate ? "default" : "outline"}
          onClick={() => setAutoRotate(!autoRotate)}
          className="bg-gray-800 hover:bg-gray-700"
          size="sm"
        >
          {autoRotate ? "Stop Rotation" : "Auto Rotate"}
        </Button>
      </div>

      {/* Reset view button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          onClick={() => {
            setResetView(true)
            setTimeout(() => setResetView(false), 100)
          }}
          className="bg-gray-800 hover:bg-gray-700"
          size="sm"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset View
        </Button>
      </div>

      {/* Navigation arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          onClick={() => {
            const views: ViewType[] = ["front", "side", "rear", "top"]
            const currentIndex = views.indexOf(currentView as ViewType)
            const prevIndex = (currentIndex - 1 + views.length) % views.length
            handleViewChange(views[prevIndex])
          }}
          className="bg-gray-800 hover:bg-gray-700 rounded-full"
          size="icon"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          onClick={() => {
            const views: ViewType[] = ["front", "side", "rear", "top"]
            const currentIndex = views.indexOf(currentView as ViewType)
            const nextIndex = (currentIndex + 1) % views.length
            handleViewChange(views[nextIndex])
          }}
          className="bg-gray-800 hover:bg-gray-700 rounded-full"
          size="icon"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
