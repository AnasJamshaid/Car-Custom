// hooks/use-gemini.tsx
'use client';

import { useState, useCallback } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useGemini() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi there! I'm your car customization assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || loading) return false;
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          `HTTP ${res.status} ${res.statusText}${errData ? ' - ' + JSON.stringify(errData) : ''}`
        );
      }

      const data = await res.json();

      const reply = data.candidates?.[0]?.output;
      if (!reply) throw new Error('Invalid response format from server.');

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      return true;
    } catch (err) {
      console.error(err);
      let userMsg = 'Sorry, something went wrong. Please try again later.';
      if (err instanceof Error) {
        if (err.message.includes('Server API key is missing')) {
          userMsg = 'API key is not configured on the server.';
        } else if (err.message.startsWith('HTTP 404')) {
          userMsg = 'Model not found. Check your model name or API version on the server.';
        } else if (err.message.startsWith('HTTP 400')) {
          userMsg = 'Bad request. There may be an issue with the API configuration on the server.';
        } else if (err.message.startsWith('HTTP 403')) {
          userMsg = 'Access denied. Your API key may not have permission on the server.';
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: userMsg }]);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { messages, loading, sendMessage };
}