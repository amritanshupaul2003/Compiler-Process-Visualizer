'use client';

import { useState, useEffect } from 'react';
import { SemanticInfo } from '@/types/compiler';

interface SemanticVisualizerProps {
  semantic: SemanticInfo;
  speed: number;
}

export default function SemanticVisualizer({ semantic, speed }: SemanticVisualizerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const symbols = Object.entries(semantic);

  useEffect(() => {
    if (!isPlaying || symbols.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= symbols.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [symbols, speed, isPlaying]);

  if (!symbols.length) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-400">No semantic information available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Semantic Analysis</h3>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Symbol Table */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="font-semibold text-gray-400 mb-3">Symbol Table</h4>
          <div className="space-y-2">
            {symbols.map(([name, info], idx) => (
              <div
                key={name}
                className={`p-3 rounded-lg transition-all duration-300 transform
                  ${idx === currentIndex 
                    ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 scale-105 ring-2 ring-blue-400' 
                    : 'bg-gray-800/50 hover:bg-gray-800'
                  }`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="font-mono font-semibold text-lg">{name}</div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold
                    ${info.initialized ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}
                  >
                    {info.initialized ? '✓' : '✗'}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="text-sm text-gray-400">Type:</div>
                  <div className="px-2 py-1 bg-gray-700 rounded font-mono">{info.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Symbol Details */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="font-semibold text-gray-400 mb-3">Symbol Details</h4>
          {symbols[currentIndex] && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🔤</div>
                <div className="text-2xl font-mono font-bold">
                  {symbols[currentIndex][0]}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Data Type</div>
                  <div className="text-lg font-semibold text-blue-300">
                    {symbols[currentIndex][1].type}
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Initialized</div>
                  <div className={`text-lg font-semibold ${symbols[currentIndex][1].initialized ? 'text-green-300' : 'text-yellow-300'}`}>
                    {symbols[currentIndex][1].initialized ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">Memory Information</div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Address:</span>
                    <span className="font-mono">0x{(0x1000 + currentIndex * 4).toString(16).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-mono">4 bytes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="font-semibold text-gray-400 mb-3">Type Checking Visualization</h4>
        <div className="flex items-center justify-center h-24">
          <div className="relative">
            {/* Type checking animation */}
            {symbols.map((_, idx) => (
              <div
                key={idx}
                className={`absolute w-8 h-8 rounded-full transition-all duration-500
                  ${idx <= currentIndex 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 scale-100 opacity-100' 
                    : 'bg-gray-700 scale-75 opacity-50'
                  }`}
                style={{
                  left: `${idx * 40}px`,
                  animation: idx === currentIndex && isPlaying ? 'pulse 2s infinite' : 'none',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          Checking symbol {currentIndex + 1} of {symbols.length}
        </div>
      </div>
    </div>
  );
}