"use client"

import React, { Component } from 'react'
import { FallbackCar } from './fallback-car'
import { Html, Center } from '@react-three/drei'

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Model Error Boundary caught an error:", {
      error: error?.message || "Unknown error",
      stack: error?.stack || "No stack trace",
      componentStack: errorInfo?.componentStack || "No component stack"
    })
    
    this.setState({
      errorInfo
    })
    
    // Notify parent component
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <>
          <Html center position={[0, 2, 0]}>
            <div style={{ 
              background: 'rgba(0,0,0,0.8)', 
              padding: '20px', 
              borderRadius: '8px', 
              color: 'red',
              maxWidth: '300px'
            }}>
              <h3 style={{ marginTop: 0 }}>Error Loading 3D Model</h3>
              <p>{this.state.error?.message || "An unknown error occurred"}</p>
              <p style={{ fontSize: '0.8em', opacity: 0.8 }}>Check the console for more details.</p>
            </div>
          </Html>
          <Center>
            <FallbackCar color={this.props.fallbackColor || "#240046"} />
          </Center>
        </>
      )
    }

    return this.props.children
  }
}

export default ModelErrorBoundary 