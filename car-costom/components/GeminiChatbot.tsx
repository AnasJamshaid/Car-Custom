'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGemini, Message } from '@/hooks/use-gemini';
import Link from 'next/link';

export default function GeminiChatbot() {
  const { messages, loading, sendMessage } = useGemini();
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !input.trim()) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const toggleChat = () => {
    setIsOpen(open => !open);
    setIsMinimized(false);
  };
  const toggleMinimize = () => setIsMinimized(min => !min);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <Button onClick={toggleChat} className="rounded-full w-14 h-14 bg-[#00F5D4] hover:bg-[#00D4B8] text-black shadow-lg">
          <Bot size={24} />
        </Button>
      )}

      {isOpen && (
        <div className={`bg-gray-900 border border-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isMinimized ? 'h-16 w-72' : 'h-96 w-80 sm:w-96'}`}>
          {/* Header */}
          <div className="bg-gray-800 p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-[#00F5D4]" />
              <span className="font-medium text-white">Car Assistant</span>
            </div>
            <div className="flex space-x-2">
              <Button onClick={toggleMinimize} variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-700">
                {isMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
              </Button>
              <Button onClick={toggleChat} variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-700">
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
              {messages.map((msg: Message, i: number) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-white rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}

          {/* Input */}
          {!isMinimized && (
            <form onSubmit={handleSubmit} className="border-t border-gray-800 p-3 bg-gray-900">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00F5D4] focus:border-transparent"
                  placeholder="Type a message..."
                />
                <Button type="submit" disabled={loading || !input.trim()} className="rounded-full w-8 h-8 bg-[#00F5D4] hover:bg-[#00D4B8] text-black p-1">
                  <Send size={16} />
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
