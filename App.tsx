import React, { useState } from 'react';
import { Experience } from './components/Experience';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [isThinking, setIsThinking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'blink'>('neutral');

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Experience isThinking={isThinking} expression={expression} />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-green-400 drop-shadow-lg">
              罗小黑
            </h1>
            <p className="text-sm text-gray-400 opacity-80">The Legend of Hei • 3D Interactive</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-mono">
             Powered by Gemini 2.5
          </div>
        </div>

        {/* Chat Interface */}
        <div className="w-full max-w-md self-center md:self-end pointer-events-auto">
          <ChatInterface 
            onThinkingStateChange={setIsThinking} 
            onExpressionChange={setExpression}
          />
        </div>
      </div>
    </div>
  );
}