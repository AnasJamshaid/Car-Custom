"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useLoader } from "@react-three/fiber"
import { useAnimations, Center, Html } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Mesh, LoadingManager } from "three"
import { FallbackCar } from "./fallback-car"

export function SimpleCarModel({
  modelPath = "/models/car2.glb",
  color = "#00F5D4", // Cyber Green
  scale = 1.5,
  position = [0, -1, 0],
  rotation = [0, Math.PI / 2, 0],
  onLoad = (data) => {},
  onError = (err) => {},
}) {
  const group = useRef()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  // Create loading manager with enhanced event handling
  const loadingManager = new LoadingManager()
  
  // Configure loading manager events
  loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading file: ${url}`)
    setLoading(true)
  }
  
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = Math.round((itemsLoaded / itemsTotal) * 100)
    console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} items (${progress}%)`)
    setLoadingProgress(progress)
  }
  
  loadingManager.onLoad = () => {
    console.log('Loading complete!')
    setLoading(false)
  }
  
  loadingManager.onError = (url) => {
    console.error(`Error loading: ${url}`)
    const errorMsg = `Failed to load model from ${url}`
    setError(new Error(errorMsg))
    onError(new Error(errorMsg))
  }
  
  // Use loader hook with the enhanced loading manager
  const gltf = useLoader(
    GLTFLoader, 
    modelPath, 
    (loader) => {
      // Configure the loader instead of passing loadingManager directly
      loader.manager = loadingManager;
    },
    (error) => {
      console.error("Error loading model:", error)
      setError(error)
      onError(error)
    }
  )
  
  // Setup animations if gltf is loaded
  const { actions } = useAnimations(gltf?.animations || [], group)
  
  // Apply color on first load
  useEffect(() => {
    if (gltf?.scene) {
      console.log("GLTF model loaded successfully:", {
        path: modelPath,
        hasScene: !!gltf.scene,
        childCount: gltf.scene.children.length,
        animations: gltf.animations?.length || 0
      })
      
      setLoading(false)
      applyColorToModel(gltf.scene, color)
      
      // Log model structure to help with debugging
      console.log("Model structure:")
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          console.log(`- Mesh: ${child.name}, material: ${child.material.name || 'unnamed'}`)
        }
      })
      
      // Notify parent
      onLoad({
        scene: gltf.scene,
        animations: gltf.animations || [],
        actions: actions || {},
        usingBackup: false
      })
    }
  }, [gltf, actions, color, onLoad, modelPath])
  
  // Update color when it changes
  useEffect(() => {
    if (gltf?.scene) {
      applyColorToModel(gltf.scene, color)
    }
  }, [color, gltf])
  
  const applyColorToModel = (scene, color) => {
    if (!scene) return
    
    scene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        // For car2.glb specifically we want to color the body parts
        // but leave wheels, glass, and other special parts untouched
        const name = child.name.toLowerCase()
        
        // Check if this is a part we should color (body parts)
        // Skip parts that should keep their original color
        if (name.includes('body') || 
            name.includes('car') || 
            name.includes('frame') ||
            (!name.includes('wheel') && 
             !name.includes('glass') && 
             !name.includes('light') &&
             !name.includes('interior'))) {
            
          // Clone the material if not already cloned
          if (!child.material._isCloned) {
            child.material = child.material.clone()
            child.material._isCloned = true
          }
          
          // Set color
          if (child.material.color) {
            child.material.color.set(color)
            child.material.roughness = 0.3
            child.material.metalness = 0.8
            child.material.needsUpdate = true
            
            console.log(`Applied color to: ${child.name}`)
          }
        }
      }
    })
  }
  
  // Show error fallback
  if (error) {
    return (
      <>
        <Html center position={[0, 2, 0]}>
          <div style={{ background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '8px', color: 'red' }}>
            Error loading model. Using geometric fallback.
            <div style={{ fontSize: '0.8em', marginTop: '10px', wordBreak: 'break-word' }}>
              {error.message || "Unknown error"}
            </div>
          </div>
        </Html>
        <FallbackCar color={color} />
      </>
    )
  }
  
  // Show loading fallback with progress
  if (loading && !gltf?.scene) {
    return (
      <>
        <Html center>
          <div style={{ background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
            <div style={{ marginBottom: '12px' }}>Loading 3D model...</div>
            <div style={{ width: '150px', height: '6px', backgroundColor: '#222', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${loadingProgress}%`,
                  backgroundColor: '#00F5D4',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <div style={{ fontSize: '0.8em', marginTop: '8px' }}>{loadingProgress}%</div>
          </div>
        </Html>
        <FallbackCar color={color} />
      </>
    )
  }
  
  // Make sure we have a valid scene
  if (!gltf || !gltf.scene) {
    console.error("No scene available in GLTF model")
    return <FallbackCar color={color} />
  }
  
  // Render the model
  return (
    <Center>
      <group 
        ref={group}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        <primitive object={gltf.scene} />
      </group>
    </Center>
  )
}