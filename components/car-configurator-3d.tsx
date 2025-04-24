"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useProgress,
  useAnimations,
  Stats,
  SpotLight,
  BakeShadows,
  useGLTF,
  Center,
} from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { 
  Mesh, 
  MeshStandardMaterial, 
  Color, 
  Group, 
  AnimationMixer, 
  Vector3, 
  Vector3Tuple 
} from "three"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  RotateCcw,
  Sun,
  Palette,
  Gauge,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  RefreshCw,
  Layers,
  AlertTriangle,
  Camera,
} from "lucide-react"
import { SimpleCarModel } from "./simple-car-model"
import ModelInspector from "./model-inspector"
import ModelErrorBoundary from "./model-error-boundary"
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { FallbackCar } from "./fallback-car"

// Define types for animation and parts
type AnimationName = string;
type PartName = string;
type PartCategory = string;
type PartVisibility = Record<PartName, boolean>;
type PartsByCategory = Record<PartCategory, PartName[]>;

// Add this type definition for performance stats
interface CustomStats {
  horsepower: number;
  torque: number;
  acceleration: number;
  topSpeed: number;
  weight: number;
  [key: string]: number; // Add index signature for dynamic access
}

// Add type for option impacts
interface PerformanceImpact {
  [key: string]: number;
}

// Add type for wheel and body kit options
interface Option {
  id: string;
  name: string;
  performanceImpact: PerformanceImpact;
}

// Loading screen component
function Loader() {
  const { progress, errors } = useProgress()

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-black/80 p-6 rounded-lg">
        {errors.length > 0 ? (
          <div className="text-red-500 flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium mb-2">Error loading 3D model</p>
            <p className="text-xs opacity-80 max-w-[300px] text-center">
              Using fallback model. Please check the console for details.
            </p>
          </div>
        ) : (
          <>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-gray-200">Loading 3D Model... {progress.toFixed(0)}%</p>
          </>
        )}
      </div>
    </Html>
  )
}

// Camera controls with features
function CameraControls({
  autoRotate = false,
  resetTrigger = 0,
  cameraPosition = [5, 2, 5] as Vector3Tuple,
  onPositionChange = (pos: Vector3Tuple) => {},
}) {
  const controlsRef = useRef<OrbitControlsType | null>(null)
  const { camera } = useThree()

  // Reset view when triggered
  useEffect(() => {
    if (controlsRef.current && resetTrigger > 0) {
      camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2])
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }, [resetTrigger, camera, cameraPosition])

  // Update camera position for external components
  useFrame(() => {
    if (controlsRef.current) {
      const pos: Vector3Tuple = [
        Number(camera.position.x.toFixed(2)), 
        Number(camera.position.y.toFixed(2)), 
        Number(camera.position.z.toFixed(2))
      ]
      onPositionChange(pos)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      enableZoom={true}
      enablePan={true}
      minDistance={0.5}
      maxDistance={20}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 1.8}
      target={[0, 0, 0]}
    />
  )
}

// Environment component with dynamic switching
function SceneEnvironment({ 
  preset = "sunset" as const, 
  intensity = 1 
}) {
  // Use type assertion to handle the preset
  const environmentPreset = preset as "sunset" | "night" | "apartment" | "city" | "dawn" | "forest" | "lobby" | "park" | "studio" | "warehouse";

  return (
    <>
      <Environment preset={environmentPreset} background={true} blur={0.8} />
      <ambientLight intensity={0.3 * intensity} />
      <SpotLight
        position={[10, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2 * intensity}
        castShadow
        shadow-bias={-0.0001}
      />
      <BakeShadows />
    </>
  )
}

// Performance monitoring component
function PerformanceMonitor({ show = false }) {
  if (!show) return null
  return <Stats className="stats-panel" />
}

// Main 3D configurator component
export default function CarConfigurator3D() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [carColor, setCarColor] = useState("#00F5D4")
  const [wheelType, setWheelType] = useState("default")
  const [environment, setEnvironment] = useState("warehouse")
  const [partVisibility, setPartVisibility] = useState<PartVisibility>({})
  const [detectableParts, setDetectableParts] = useState<PartsByCategory>({})
  const [availableAnimations, setAvailableAnimations] = useState<AnimationName[]>([])
  const [animationState, setAnimationState] = useState({ current: null as AnimationName | null, playing: false })
  const [resetTrigger, setResetTrigger] = useState(0)
  const [showPerformance, setShowPerformance] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [cameraPosition, setCameraPosition] = useState<Vector3Tuple>([5, 2, 5])
  const [activeTab, setActiveTab] = useState("exterior")
  const [customStats, setCustomStats] = useState<CustomStats>({
    horsepower: 475,
    torque: 406,
    acceleration: 3.8,
    topSpeed: 174,
    weight: 3585
  })
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(false)
  const group = useRef<Group | null>(null)
  
  // Colors for our futuristic UI
  const colors = [
    { name: "Cosmic Purple", hex: "#240046" },
    { name: "Electric Blue", hex: "#3A86FF" },
    { name: "Neon Pink", hex: "#FF006E" },
    { name: "Cyber Green", hex: "#00F5D4" },
    { name: "Solar Gold", hex: "#FFD60A" },
    { name: "Deep Space", hex: "#001233" },
    { name: "Fusion Red", hex: "#E71D36" },
    { name: "Ultraviolet", hex: "#7209B7" }
  ]

  // Wheel options
  const wheelOptions = [
    { id: "sport", name: "Sport Alloy", performanceImpact: { acceleration: +0.1, weight: -25 } },
    { id: "default", name: "Standard", performanceImpact: { acceleration: 0, weight: 0 } },
    { id: "racing", name: "Racing", performanceImpact: { acceleration: +0.2, weight: -40 } },
    { id: "luxury", name: "Luxury", performanceImpact: { acceleration: -0.1, weight: +15 } }
  ]
  
  // Body kit options
  const bodyKitOptions = [
    { id: "standard", name: "Standard", performanceImpact: { topSpeed: 0, weight: 0 } },
    { id: "sport", name: "Sport", performanceImpact: { topSpeed: +5, weight: -15 } },
    { id: "racing", name: "Racing", performanceImpact: { topSpeed: +12, weight: -40 } },
    { id: "wide", name: "Wide Body", performanceImpact: { topSpeed: -3, weight: +35 } }
  ]
  
  // Handler for parts detection
  const handlePartsDetected = (parts: PartsByCategory) => {
    setDetectableParts(parts)
    
    // Initialize visibility state for all parts (all visible by default)
    const initialVisibility: PartVisibility = {}
    Object.keys(parts).forEach((category) => {
      parts[category].forEach((partName) => {
        initialVisibility[partName] = true
      })
    })
    
    setPartVisibility(initialVisibility)
  }
  
  // Handler for animations detection
  const handleAnimationsDetected = (animations: AnimationName[]) => {
    setAvailableAnimations(animations)
  }
  
  // View change handler
  const changeView = (view: string) => {
    switch (view) {
      case "front": setCameraPosition([0, 1, 5]); break
      case "rear": setCameraPosition([0, 1, -5]); break
      case "side": setCameraPosition([5, 1, 0]); break
      case "top": setCameraPosition([0, 5, 0]); break
      default: setCameraPosition([3, 2, 3])
    }
  }
  
  // Part visibility toggle handler
  const togglePartVisibility = (partName: string, visible: boolean) => {
    setPartVisibility((prev) => ({
      ...prev,
      [partName]: visible,
    }))
  }

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current && 'webkitRequestFullscreen' in containerRef.current) {
        (containerRef.current as any).webkitRequestFullscreen()
      } else if (containerRef.current && 'msRequestFullscreen' in containerRef.current) {
        (containerRef.current as any).msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ('webkitExitFullscreen' in document) {
        (document as any).webkitExitFullscreen()
      }
    }
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  // Reset view handler
  const resetView = () => {
    setCameraPosition([5, 2, 5])
    setResetTrigger((prev) => prev + 1)
  }

  // Animation handler
  const playAnimation = (animName: AnimationName) => {
    if (animationState.current === animName && animationState.playing) {
      setAnimationState({ current: animName, playing: false })
    } else {
      setAnimationState({ current: animName, playing: true })
    }
  }
  
  // Update stats based on selected options
  const updateStats = (optionType: string, optionId: string) => {
    let options: Option[] = [];
    let currentStats = {...customStats};
    
    if (optionType === 'wheel') {
      options = wheelOptions as Option[];
      setWheelType(optionId);
    } else if (optionType === 'bodyKit') {
      options = bodyKitOptions as Option[];
    }
    
    const selectedOption = options.find(option => option.id === optionId);
    if (selectedOption && selectedOption.performanceImpact) {
      Object.keys(selectedOption.performanceImpact).forEach(stat => {
        if (stat in customStats) {
          currentStats[stat] = customStats[stat] + selectedOption.performanceImpact[stat];
        }
      });
      setCustomStats(currentStats);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] md:h-[700px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950"
    >
      {modelError && (
        <div className="absolute top-4 left-0 right-0 z-50 flex justify-center">
          <div className="bg-red-900/80 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-lg border border-red-700">
            Error loading 3D model. Using fallback model instead.
          </div>
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        className="bg-gradient-to-b from-gray-900 to-black"
      >
        <fog attach="fog" args={["#050505", 10, 20]} />
        <color attach="background" args={["#050505"]} />
        
        <Suspense fallback={<Loader />}>
          <CameraControls 
            autoRotate={autoRotate} 
            resetTrigger={resetTrigger} 
            cameraPosition={cameraPosition}
            onPositionChange={setCameraPosition}
          />
          
          <SceneEnvironment preset={environment as any} intensity={1.2} />
          
          <ModelErrorBoundary
            fallbackColor={carColor}
            onError={(err: Error) => {
              console.error("Error boundary caught:", err);
              setModelError(true);
              // Provide fallback animations for UI
              setAvailableAnimations(["doors_open", "engine_start", "lights_flash"]);
            }}
          >
            <Suspense fallback={
              <FallbackCar color={carColor} />
            }>
              <SimpleCarModel
                modelPath="/models/car2.glb"
                color={carColor}
                scale={1.5}
                position={[0, -1, 0]}
                rotation={[0, Math.PI / 2, 0]}
                onLoad={(data: any) => {
                  console.log("Model loaded successfully with data:", data);
                  setModelLoaded(true);
                  if (data.animations?.length) {
                    const animNames = data.animations.map((a: any) => a.name).filter(Boolean);
                    console.log("Available animations:", animNames);
                    setAvailableAnimations(animNames);
                  } else {
                    console.log("No animations found in model");
                    // Provide fallback animations for UI
                    setAvailableAnimations(["doors_open", "engine_start", "lights_flash"]);
                  }
                }}
                onError={(err: any) => {
                  console.error("Error in car model:", err);
                  setModelError(true);
                  // Provide fallback animations for UI
                  setAvailableAnimations(["doors_open", "engine_start", "lights_flash"]);
                }}
              />
            </Suspense>
          </ModelErrorBoundary>
          
          {/* Add model inspector for debugging */}
          {modelLoaded && <ModelInspector target={(document.querySelector(".scene") as any)?.object} visible={showPerformance} />}
          
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.6} 
            width={10} 
            height={10} 
            blur={1} 
            far={10} 
          />
          
          <SpotLight 
            position={[5, 10, 2]} 
            angle={0.3} 
            penumbra={0.8} 
            intensity={1.5} 
            castShadow 
            color="#80a0ff"
          />
          
          <SpotLight 
            position={[-5, 8, -2]} 
            angle={0.3} 
            penumbra={0.8} 
            intensity={1} 
            castShadow 
            color="#ff80bf"
          />
          
          <BakeShadows />
          
            <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={0.3} />
            </EffectComposer>
        </Suspense>
        
        {showPerformance && <PerformanceMonitor show={showPerformance} />}
      </Canvas>

      {/* Left Panel - Controls */}
      <div className="absolute top-0 left-0 w-64 h-full p-4 z-10">
        <div className="h-full flex flex-col space-y-4">
          <div className="backdrop-blur-md bg-black/30 text-white rounded-xl p-4 border border-gray-800 shadow-glow">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
              Customize
            </h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 bg-black/50">
                <TabsTrigger value="exterior" className="data-[state=active]:bg-indigo-900/50">
                  Exterior
              </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-indigo-900/50">
                  Performance
              </TabsTrigger>
            </TabsList>
              
              <TabsContent value="exterior" className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-400">Paint Color</Label>
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    {colors.map((color) => (
                  <button
                    key={color.hex}
                        className={`w-full aspect-square rounded-md transition hover:scale-110 ${
                          carColor === color.hex ? 'ring-2 ring-blue-500 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                        onClick={() => setCarColor(color.hex)}
                  />
                ))}
              </div>
        </div>

                <div>
                  <Label className="text-xs text-gray-400">Wheel Type</Label>
                  <Select 
                    value={wheelType} 
                    onValueChange={(value) => updateStats('wheel', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="Select wheel type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {wheelOptions.map((wheel) => (
                        <SelectItem key={wheel.id} value={wheel.id}>
                          {wheel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>

                <div>
                  <Label className="text-xs text-gray-400">Body Kit</Label>
                  <Select 
                    defaultValue="standard" 
                    onValueChange={(value) => updateStats('bodyKit', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="Select body kit" />
                      </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {bodyKitOptions.map((kit) => (
                        <SelectItem key={kit.id} value={kit.id}>
                          {kit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                <div>
                  <Label className="text-xs text-gray-400">Environment</Label>
                  <Select value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="sunset">Sunset</SelectItem>
                      <SelectItem value="dawn">Dawn</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <Label className="text-xs text-gray-400">Auto Rotation</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={autoRotate}
                      onCheckedChange={setAutoRotate}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm">{autoRotate ? "On" : "Off"}</span>
                  </div>
                </div>
                
                {availableAnimations.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-400">Animations</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {availableAnimations.map((anim) => (
                          <Button
                            key={anim}
                            size="sm"
                            variant={animationState.current === anim && animationState.playing ? "default" : "outline"}
                          className={
                              animationState.current === anim && animationState.playing
                              ? "bg-blue-700 hover:bg-blue-800 text-xs h-8"
                              : "bg-black/50 border-gray-700 hover:bg-gray-800 text-xs h-8"
                          }
                            onClick={() => playAnimation(anim)}
                          >
                          {animationState.current === anim && animationState.playing ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                          {anim ? anim.split("_").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "Unnamed Animation"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Specs */}
      <div className="absolute top-0 right-0 w-64 h-full p-4 z-10">
        <div className="h-full flex flex-col space-y-4">
          <div className="backdrop-blur-md bg-black/30 text-white rounded-xl p-4 border border-gray-800 shadow-glow">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
              Vehicle Specs
            </h3>
            
            <div className="space-y-4">
              <div>
                      <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Horsepower</span>
                  <Badge className="bg-blue-900/50 text-blue-300">{customStats.horsepower} HP</Badge>
                      </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                    style={{ width: `${(customStats.horsepower / 550) * 100}%` }}
                              />
                            </div>
                      </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Torque</span>
                  <Badge className="bg-blue-900/50 text-blue-300">{customStats.torque} lb-ft</Badge>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                    style={{ width: `${(customStats.torque / 500) * 100}%` }}
                  />
                    </div>
                  </div>

              <div>
                    <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">0-60 MPH</span>
                  <Badge className="bg-blue-900/50 text-blue-300">{customStats.acceleration.toFixed(1)}s</Badge>
                    </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                    style={{ width: `${(1 - (customStats.acceleration - 2) / 4) * 100}%` }}
                    />
                  </div>
                  </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Top Speed</span>
                  <Badge className="bg-blue-900/50 text-blue-300">{customStats.topSpeed} MPH</Badge>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                    style={{ width: `${(customStats.topSpeed / 200) * 100}%` }}
                  />
                </div>
                  </div>

              <div>
                        <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Weight</span>
                  <Badge className="bg-blue-900/50 text-blue-300">{customStats.weight} lbs</Badge>
                        </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                    style={{ width: `${(1 - (customStats.weight - 3000) / 1000) * 100}%` }}
                        />
                      </div>
                  </div>
                    </div>
                  </div>
                    </div>
      </div>
      
      {/* Bottom Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center z-10">
        <div className="backdrop-blur-md bg-black/30 text-white rounded-full px-4 py-2 border border-gray-800 shadow-glow flex items-center space-x-2">
                      <Button
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-gray-800" 
            onClick={resetView}
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
                      </Button>
          
          <Separator orientation="vertical" className="h-6 bg-gray-700" />
          
                      <Button
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-gray-800" 
            onClick={() => changeView("front")}
            title="Front View"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-gray-800" 
            onClick={() => changeView("rear")}
            title="Rear View"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-gray-800" 
            onClick={() => changeView("side")}
            title="Side View"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-gray-800" 
            onClick={() => changeView("top")}
            title="Top View"
          >
            <Layers className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 bg-gray-700" />
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-gray-800" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-gray-800" 
            onClick={() => setShowPerformance(!showPerformance)}
            title="Toggle Performance Stats"
          >
            <Gauge className="h-4 w-4" />
                      </Button>
        </div>
      </div>
    </div>
  )
}
