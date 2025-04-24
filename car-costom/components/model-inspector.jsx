import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export default function ModelInspector({ target, visible = false }) {
  const [isVisible, setIsVisible] = useState(visible);
  const [modelInfo, setModelInfo] = useState({});
  const { scene } = useThree();

  useEffect(() => {
    if (!target) return;
    
    // Get model info
    const info = {
      name: target.name || 'Unnamed',
      type: target.type || 'Unknown',
      children: target.children?.length || 0,
      position: target.position ? [...target.position] : [0,0,0],
      rotation: target.rotation ? [
        target.rotation.x, 
        target.rotation.y, 
        target.rotation.z
      ] : [0,0,0],
      scale: target.scale ? [...target.scale] : [1,1,1],
      materials: collectMaterials(target),
      meshes: countMeshes(target),
    };
    
    setModelInfo(info);
  }, [target]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  function collectMaterials(object) {
    const materials = new Set();
    
    object.traverse((child) => {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => materials.add(mat.name || 'unnamed'));
        } else {
          materials.add(child.material.name || 'unnamed');
        }
      }
    });
    
    return Array.from(materials);
  }
  
  function countMeshes(object) {
    let count = 0;
    object.traverse((child) => {
      if (child.isMesh) count++;
    });
    return count;
  }

  if (!target) return null;
  
  return (
    <Html position={[0, 2, 0]} center>
      <div className="bg-black/70 text-white p-3 rounded-lg text-xs shadow-xl backdrop-blur-sm w-96">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Model Inspector</h3>
          <button 
            onClick={toggleVisibility} 
            className="text-white bg-blue-600 px-2 py-1 rounded text-xs"
          >
            {isVisible ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {isVisible && (
          <div className="space-y-2">
            <div>
              <span className="font-bold">Name:</span> {modelInfo.name}
            </div>
            <div>
              <span className="font-bold">Type:</span> {modelInfo.type}
            </div>
            <div>
              <span className="font-bold">Children:</span> {modelInfo.children}
            </div>
            <div>
              <span className="font-bold">Meshes:</span> {modelInfo.meshes}
            </div>
            <div>
              <span className="font-bold">Position:</span> [{modelInfo.position.map(v => v.toFixed(2)).join(', ')}]
            </div>
            <div>
              <span className="font-bold">Rotation:</span> [{modelInfo.rotation.map(v => v.toFixed(2)).join(', ')}]
            </div>
            <div>
              <span className="font-bold">Scale:</span> [{modelInfo.scale.map(v => v.toFixed(2)).join(', ')}]
            </div>
            <div>
              <span className="font-bold">Materials:</span> 
              <ul className="ml-2">
                {modelInfo.materials.map((mat, i) => (
                  <li key={i}>• {mat}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
} 