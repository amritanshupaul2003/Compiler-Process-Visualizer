'use client';

import { useState, useEffect } from 'react';

interface IRVisualizerProps {
  ir: string[];
  speed: number;
}

export default function IRVisualizer({ ir, speed }: IRVisualizerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || ir.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= ir.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [ir, speed, isPlaying]);

  // Derive registers state from currentIndex and ir (avoid setState in effect)
  const registers = (() => {
    const newRegisters: { [key: string]: string } = {};
    for (let i = 0; i <= currentIndex && i < ir.length; i++) {
      const instruction = ir[i];
      const match = instruction.match(/^(t\d+)\s*=/);
      if (match) {
        const register = match[1];
        const value = instruction.split('=')[1]?.trim() || '?';
        newRegisters[register] = value;
      }
    }
    return newRegisters;
  })();

  const parseInstruction = (instruction: string) => {
    if (!instruction) return { type: 'unknown', parts: [] };
    
    if (instruction.includes('=')) {
      const [left, right] = instruction.split('=');
      return { 
        type: 'assignment',
        target: left.trim(),
        value: right.trim()
      };
    }
    
    return { type: 'operation', parts: instruction.split(' ') };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Intermediate Representation (IR)</h3>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IR Instructions */}
        <div className="lg:col-span-2 bg-gray-900 rounded-lg p-4">
          <h4 className="font-semibold text-gray-400 mb-3">IR Instructions</h4>
          <div className="space-y-2">
            {ir.map((instruction, idx) => {
              const parsed = parseInstruction(instruction);
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg font-mono transition-all duration-300 transform cursor-pointer
                    ${idx === currentIndex 
                      ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 scale-105 ring-2 ring-purple-400' 
                      : 'bg-gray-800/50 hover:bg-gray-800'
                    }
                    ${idx < currentIndex ? 'opacity-100' : 'opacity-50'}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3
                      ${idx <= currentIndex ? 'bg-purple-600' : 'bg-gray-700'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      {parsed.type === 'assignment' ? (
                        <>
                          <span className="text-green-300">{parsed.target}</span>
                          <span className="mx-2">=</span>
                          <span className="text-blue-300">{parsed.value}</span>
                        </>
                      ) : (
                        <span className="text-gray-300">{instruction}</span>
                      )}
                    </div>
                    {idx < currentIndex && (
                      <div className="text-green-400">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registers & Current Instruction */}
        <div className="space-y-6">
          {/* Current Instruction */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Current Instruction</h4>
            {ir[currentIndex] && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-mono font-bold text-white">
                    {ir[currentIndex]}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-1 bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Step</div>
                    <div className="text-lg font-semibold">{currentIndex + 1}/{ir.length}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-800 rounded flex-1">
                    <div className="text-sm text-gray-400">Type</div>
                    <div className="text-lg font-semibold text-yellow-300">
                      {parseInstruction(ir[currentIndex]).type}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Register Allocation</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(registers).map(([register, value]) => (
                <div
                  key={register}
                  className="bg-gray-800 p-2 rounded text-center"
                >
                  <div className="font-mono text-sm text-purple-300">{register}</div>
                  <div className="font-mono font-semibold">{value}</div>
                </div>
              ))}
              {Object.keys(registers).length === 0 && (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  No registers allocated yet
                </div>
              )}
            </div>
          </div>

          {/* Optimization Status */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Optimizations</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Constant Folding</span>
                <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">
                  Applied
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dead Code Elimination</span>
                <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-xs">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Register Allocation</span>
                <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="mt-6 bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-400">Code Generation Progress</h4>
          <span className="text-sm text-gray-400">
            {Math.round(((currentIndex + 1) / ir.length) * 100)}%
          </span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / ir.length) * 100}%` }}
            ></div>
          </div>
          {/* Markers for each instruction */}
          <div className="flex justify-between mt-1">
            {ir.map((_, idx) => (
              <div
                key={idx}
                className={`w-1 h-3 ${idx <= currentIndex ? 'bg-purple-400' : 'bg-gray-600'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}