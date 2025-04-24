"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestApiKey() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const testApiKey = async () => {
    setLoading(true);
    setResult("");
    
    if (!API_KEY) {
      setResult(`❌ API key not found. Please check your .env.local file.`);
      setLoading(false);
      return;
    }
    
    try {
      // First try v1beta endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: "Say hello" }]
              }
            ]
          })
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ API key is working with v1beta endpoint!\n\nResponse: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ v1beta endpoint error: ${JSON.stringify(data, null, 2)}\n\nTrying v1 endpoint...`);
        
        // Try v1 endpoint as fallback
        try {
          const v1Response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: "Say hello" }]
                  }
                ]
              })
            }
          );
          
          const v1Data = await v1Response.json();
          
          if (v1Response.ok) {
            setResult(prev => `${prev}\n\n✅ v1 endpoint is working!\n\nResponse: ${JSON.stringify(v1Data, null, 2)}`);
          } else {
            setResult(prev => `${prev}\n\n❌ v1 endpoint error: ${JSON.stringify(v1Data, null, 2)}`);
          }
        } catch (v1Error) {
          setResult(prev => `${prev}\n\n❌ v1 endpoint error: ${v1Error instanceof Error ? v1Error.message : String(v1Error)}`);
        }
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-black/50 max-w-xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-4 text-white">Gemini API Key Test</h2>
      
      <div className="mb-4">
        <p className="text-gray-300 mb-2">
          {API_KEY 
            ? `Current API Key (first 10 chars): ${API_KEY.substring(0, 10)}...` 
            : "❌ API key not found. Please check your .env.local file."}
        </p>
        <Button 
          onClick={testApiKey} 
          disabled={loading || !API_KEY}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Testing..." : "Test API Key"}
        </Button>
      </div>
      
      {!API_KEY && (
        <div className="mt-4 p-3 bg-red-950 border border-red-800 rounded">
          <h3 className="text-red-400 font-semibold mb-2">API Key Not Found</h3>
          <p className="text-gray-300 text-sm">
            Create a <code className="bg-gray-800 px-1 rounded">.env.local</code> file in your project root with:
          </p>
          <pre className="bg-gray-800 p-2 mt-2 rounded text-xs overflow-auto">
            NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
          </pre>
          <p className="text-gray-300 text-sm mt-2">
            Then restart your server with <code className="bg-gray-800 px-1 rounded">npm run dev</code>
          </p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-gray-800 rounded overflow-auto max-h-80">
          <pre className="text-xs text-white whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p className="font-medium mb-2">Troubleshooting:</p>
        <ol className="list-decimal pl-5 space-y-1 mt-2">
          <li>Make sure your .env.local file is in the project root with the correct API key</li>
          <li>Restart your development server after updating .env.local</li>
          <li>Your API key might only work with specific API versions (v1beta or v1)</li>
          <li>Check if you have the Gemini API enabled in your Google Cloud Console</li>
          <li>Try getting a fresh API key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a></li>
        </ol>
      </div>
    </div>
  );
} 