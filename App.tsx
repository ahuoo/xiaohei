import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { Experience } from './components/Experience';
import { ChatInterface } from './components/ChatInterface';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

export default function App() {
  const [isThinking, setIsThinking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'blink'>('neutral');
  const modelRef = useRef<THREE.Group>(null);

  const handleExportSTL = () => {
    if (!modelRef.current) return;
    
    const exporter = new STLExporter();
    // Pass binary: true for smaller file size, though text (default) is also fine.
    const result = exporter.parse(modelRef.current, { binary: true });
    
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'LuoXiaohei.stl';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Experience 
          isThinking={isThinking} 
          expression={expression} 
          modelRef={modelRef}
        />
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
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-mono">
               Powered by Gemini 2.5
            </div>
            <button 
              onClick={handleExportSTL}
              className="bg-blue-600/80 hover:bg-blue-500 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-400/30 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download STL
            </button>
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