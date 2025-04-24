"use client"

import { useState } from "react"
import { Car, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import GeminiChatbot from "@/components/GeminiChatbot"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Top navigation */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 text-white p-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center">
          <Car className="h-5 w-5 mr-2 text-blue-400" />
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CARcustom
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-sm text-gray-300 hover:text-white transition">Models</button>
          <button className="text-sm text-gray-300 hover:text-white transition">Gallery</button>
          <button className="text-sm text-gray-300 hover:text-white transition">About</button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Banner with Trucks Image */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Background image - fixed position so it remains in view */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
            style={{ 
              backgroundImage: "url('/images/trucks-background.jpg')",
              backgroundPosition: "center 30%"
            }}
          ></div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-6 drop-shadow-lg">
            BUILD YOUR <span className="text-[#00F5D4]">DREAM RIDE</span>
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mb-10 drop-shadow-md">
            Customize every detail of your vehicle with our state-of-the-art 3D configurator
          </p>
          <Link href="/configurator" className="bg-[#00F5D4] hover:bg-[#00D4B8] text-black font-bold py-4 px-8 rounded-full uppercase tracking-wider shadow-glow">
            Launch Configurator
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Experience <span className="text-[#00F5D4]">Limitless</span> Customization
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-[#00F5D4] mb-3">Stunning Colors</h3>
              <p className="text-gray-300">Choose from a spectrum of premium colors and finishes for your vehicle</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-[#00F5D4] mb-3">Performance Wheels</h3>
              <p className="text-gray-300">Select the perfect wheels to enhance your car's style and performance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-[#00F5D4] mb-3">Advanced Body Kits</h3>
              <p className="text-gray-300">Customize with body kit options that transform the look of your vehicle</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/configurator" className="inline-flex items-center text-[#00F5D4] hover:text-[#00D4B8] font-semibold">
              Start Customizing Now
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800 text-gray-400 p-6 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-2 text-blue-400" />
              <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">CARcustom</div>
            </div>
            <p className="mt-2 text-xs text-gray-500">© 2025 CARcustom. This is a demo recreation.</p>
            <p className="text-xs text-gray-500">BMW and BMW M4 are registered trademarks of BMW AG.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div>
              <h4 className="font-medium mb-2 text-white">Explore</h4>
              <ul className="space-y-1 text-xs">
                <li className="hover:text-blue-400 transition cursor-pointer">Our Models</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Gallery</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Configurator</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Technology</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-white">Company</h4>
              <ul className="space-y-1 text-xs">
                <li className="hover:text-blue-400 transition cursor-pointer">About Us</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Careers</li>
                <li className="hover:text-blue-400 transition cursor-pointer">News</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-white">Legal</h4>
              <ul className="space-y-1 text-xs">
                <li className="hover:text-blue-400 transition cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Terms of Use</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Accessibility</li>
                <li className="hover:text-blue-400 transition cursor-pointer">Cookie Settings</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Gemini Chatbot */}
      <GeminiChatbot />
    </div>
  )
}
