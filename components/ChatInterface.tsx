import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToXiaohei } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

interface ChatInterfaceProps {
  onThinkingStateChange: (isThinking: boolean) => void;
  onExpressionChange: (expression: 'neutral' | 'happy' | 'blink') => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onThinkingStateChange, onExpressionChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: 'Meow~ (Hello human!)' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Random blink effect
  useEffect(() => {
      const interval = setInterval(() => {
          if (!isLoading) {
             onExpressionChange('blink');
          }
      }, 4000 + Math.random() * 3000);
      return () => clearInterval(interval);
  }, [isLoading, onExpressionChange]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    onThinkingStateChange(true);
    onExpressionChange('neutral');

    try {
      const reply = await sendMessageToXiaohei(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: reply,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      onExpressionChange('happy');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onThinkingStateChange(false);
      // Reset expression to neutral after a few seconds if happy
      setTimeout(() => onExpressionChange('neutral'), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Messages Area */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-4 h-[300px] overflow-y-auto flex flex-col gap-3 shadow-xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-tr-sm'
                  : 'bg-white/10 text-gray-100 rounded-tl-sm border border-white/5'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white/5 px-4 py-2 rounded-2xl rounded-tl-sm text-sm text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Chat with Xiaohei..."
          className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl px-6 font-semibold transition-colors shadow-lg shadow-green-900/20"
        >
          Send
        </button>
      </div>
    </div>
  );
};