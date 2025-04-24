"use client"

import { useState } from 'react'
import Link from 'next/link'
import CarConfigurator3D from '@/components/car-configurator-3d'
import { ChevronLeft } from 'lucide-react'

export default function ConfiguratorPage() {
  return (
    <div className="relative w-full h-screen bg-black">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/" 
          className="flex items-center text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
      </div>

      {/* Main Configurator Component */}
      <CarConfigurator3D />
    </div>
  )
} 