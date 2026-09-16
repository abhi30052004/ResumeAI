import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Assistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi ${user?.full_name}! I'm your AI Career Assistant. I can help you find internal opportunities, suggest skills to learn for your next promotion, or help improve your profile. What's on your mind?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/api/chat/assistant', { message: userMessage });
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.data.reply 
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting to my servers right now. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col space-y-4">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Bot className="w-8 h-8 text-[#635BFF]" /> AI Career Assistant
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Your personal guide for internal mobility and skill development.</p>
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-white border border-dash-border rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant' 
                    ? 'bg-gradient-to-br from-[#635BFF] to-[#A07CFF] text-white' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'assistant'
                    ? 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'
                    : 'bg-[#635BFF] text-white rounded-tr-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635BFF] to-[#A07CFF] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#635BFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#635BFF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#635BFF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about opportunities, skills, or your career path..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] resize-none max-h-32"
                rows={1}
                style={{ minHeight: '48px' }}
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-xl bg-[#635BFF] hover:bg-[#5046e5] disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4 ml-0.5 text-white" />
              </Button>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <button onClick={() => setInput("What skills should I learn for a Senior role?")} className="text-xs text-[#635BFF] bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-medium transition-colors">What skills should I learn?</button>
              <button onClick={() => setInput("Are there any open roles that match my profile?")} className="text-xs text-[#635BFF] bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-medium transition-colors">Find matching roles</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
