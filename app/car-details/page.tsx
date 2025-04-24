import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CarDetailsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">3DTuning</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="hover:text-gray-300">
              HOME
            </Link>
            <Link href="#" className="hover:text-gray-300">
              GALLERY
            </Link>
            <Link href="#" className="hover:text-gray-300">
              GARAGE
            </Link>
            <Link href="#" className="hover:text-gray-300">
              CHALLENGES
            </Link>
            <Link href="#" className="hover:text-gray-300">
              CARS SCHEDULE
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          BMW M4 2014-2020 | 3DTuning - probably the best car configurator!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Personalize your ride with 3DTuning's Car Tuning. Explore tuning parts and finishes to create a customized
          masterpiece. Elevate your driving experience.
        </p>

        <div className="mb-12">
          <Image
            src="/placeholder.svg?height=300&width=600&text=BMW+M4+Gold"
            width={600}
            height={300}
            alt="BMW M4 Gold"
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">BMW M4 2 Door Coupe 2014-2020 More Images</h2>

        <div className="mb-12">
          <Image
            src="/placeholder.svg?height=400&width=800&text=BMW+M4+Side+View"
            width={800}
            height={400}
            alt="BMW M4 Side View"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-semibold">Engine:</span> 3.0L Twin-Turbo Inline-6
              </li>
              <li>
                <span className="font-semibold">Power:</span> 425 hp @ 5,500-7,300 rpm
              </li>
              <li>
                <span className="font-semibold">Torque:</span> 406 lb-ft @ 1,850-5,500 rpm
              </li>
              <li>
                <span className="font-semibold">Transmission:</span> 6-speed manual or 7-speed dual-clutch
              </li>
              <li>
                <span className="font-semibold">0-60 mph:</span> 3.9 seconds (DCT)
              </li>
              <li>
                <span className="font-semibold">Top Speed:</span> 155 mph (limited)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Customization Options</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-semibold">Exterior Colors:</span> 8+ options including Austin Yellow
              </li>
              <li>
                <span className="font-semibold">Wheel Options:</span> Multiple designs from 18" to 20"
              </li>
              <li>
                <span className="font-semibold">Body Kits:</span> Factory M Performance and aftermarket
              </li>
              <li>
                <span className="font-semibold">Interior Trims:</span> Carbon fiber, aluminum, wood
              </li>
              <li>
                <span className="font-semibold">Performance Upgrades:</span> Exhaust, suspension, brakes
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="inline-block">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Customizing Your BMW M4
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 3DTuning. All rights reserved. This is a demo recreation.</p>
          <p className="mt-2">BMW and BMW M4 are registered trademarks of BMW AG.</p>
        </div>
      </footer>
    </div>
  )
}
