'use client';

import ListModels from '@/components/ListModels';
import Link from "next/link";

export default function ModelTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Model Test Page</h1>
        
        <div className="mb-6">
          <p className="text-white mb-4">
            This page helps you find which AI models your API key can access. The Gemini chatbot needs a compatible model.
          </p>
          
          <ListModels />
          
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-3">Troubleshooting Guide</h2>
            
            <ol className="list-decimal text-gray-300 space-y-3 ml-5">
              <li>
                <strong>Check your API key</strong>
                <p className="text-sm text-gray-400 mt-1">Make sure your API key is correctly set in the .env.local file.</p>
              </li>
              <li>
                <strong>Find available models</strong>
                <p className="text-sm text-gray-400 mt-1">Click "List Available Models" to see which models you can use.</p>
              </li>
              <li>
                <strong>Update your code</strong>
                <p className="text-sm text-gray-400 mt-1">
                  In hooks/use-gemini.tsx, update the model name and API endpoint to match an available model.
                </p>
              </li>
              <li>
                <strong>Try different API versions</strong>
                <p className="text-sm text-gray-400 mt-1">
                  Some models might be available in v1, while others are in v1beta.
                </p>
              </li>
            </ol>
          </div>
          
          <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-800">
            <h2 className="text-xl font-semibold text-white mb-3">Server-Side API (Recommended)</h2>
            
            <p className="text-gray-300 text-sm mb-4">
              We've set up a server-side API at <code className="bg-black/30 px-2 py-1 rounded">/api/gemini</code> that securely handles Gemini API requests.
              This avoids exposing your API key to the client and helps prevent 404 errors.
            </p>
            
            <div className="bg-black/40 rounded-lg p-4 text-sm">
              <h3 className="text-blue-400 font-medium mb-2">Environment Setup:</h3>
              <p className="text-gray-300 mb-2">
                Add the following to your <code className="bg-black/30 px-1 rounded">.env.local</code> file:
              </p>
              <pre className="bg-black/60 p-3 rounded overflow-auto text-xs text-gray-300">
                GEMINI_API_KEY_SERVER=your_api_key_here
              </pre>
              <p className="text-gray-400 mt-2 text-xs">
                The chatbot will now use this server-side API endpoint instead of making direct calls to Google.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 