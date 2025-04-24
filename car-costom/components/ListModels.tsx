'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function ListModels() {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    setModels([]);

    try {
      if (!API_KEY?.trim()) {
        throw new Error('API key is missing');
      }

      // Try different endpoints to find available models
      const endpoints = [
        'https://generativelanguage.googleapis.com/v1/models?key=' + API_KEY,
        'https://generativelanguage.googleapis.com/v1beta/models?key=' + API_KEY
      ];

      let successful = false;
      let modelList: string[] = [];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          
          if (response.ok) {
            const data = await response.json();
            successful = true;
            
            if (data.models && Array.isArray(data.models)) {
              const names = data.models.map((model: any) => model.name).filter(Boolean);
              modelList = [...modelList, ...names];
            }
          }
        } catch (endpointError) {
          console.error('Error with endpoint:', endpoint, endpointError);
        }
      }

      if (successful) {
        setModels(modelList);
      } else {
        throw new Error('Could not retrieve models from any API version');
      }
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-black/50 max-w-xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-4 text-white">Available AI Models</h2>
      
      <div className="mb-4">
        <p className="text-gray-300 mb-2">
          {API_KEY 
            ? `API Key is set (first 5 chars): ${API_KEY.substring(0, 5)}...` 
            : "❌ API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local"}
        </p>
        <Button 
          onClick={fetchModels} 
          disabled={loading || !API_KEY}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Loading..." : "List Available Models"}
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-white">
          <p className="font-medium">Error:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
      
      {models.length > 0 && (
        <div className="mt-4">
          <h3 className="text-white font-medium mb-2">Found {models.length} models:</h3>
          <div className="bg-gray-800 rounded p-3 max-h-80 overflow-auto">
            <ul className="space-y-1 text-sm">
              {models.map((model, index) => (
                <li key={index} className="text-gray-200">• {model}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            These are the model names you can use in your code.
          </p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Update your code to use one of these available models.</p>
        <p className="mt-1">Example:</p>
        <pre className="bg-gray-800 p-2 rounded text-xs mt-1 overflow-auto">
          const MODEL = 'models/text-bison-001';
        </pre>
      </div>
    </div>
  );
} 