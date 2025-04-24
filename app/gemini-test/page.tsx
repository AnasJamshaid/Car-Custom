"use client";

import TestApiKey from "@/components/TestApiKey";
import Link from "next/link";

export default function GeminiTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Gemini API Test Page</h1>
        
        <TestApiKey />
        
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 