'use client';

import { useState, useEffect } from 'react';

interface TargetCodeVisualizerProps {
  targetCode: {
    architecture: string;
    registers: string[];
    instructions: string[]; 
  };
  ir: string[];
  speed: number;
  language: string;
}

export default function TargetCodeVisualizer({ 
  targetCode, 
  //ir, 
  speed
}: TargetCodeVisualizerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || targetCode.instructions.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= targetCode.instructions.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [targetCode.instructions, speed, isPlaying]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Target Code Generation</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Instructions */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Generated Assembly</h4>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto">
              <div className="text-green-400 mb-2">; Architecture: {targetCode.architecture}</div>
              <div className="space-y-1">
                {targetCode.instructions.map((instruction, idx) => (
                  <div 
                    key={idx} 
                    className={`flex hover:bg-gray-800/50 px-2 py-1 rounded transition-all duration-300
                      ${idx === currentIndex ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 ring-1 ring-red-500/50' : ''}`}
                  >
                    <div className="text-gray-500 w-8 shrink-0">{idx + 1}</div>
                    <div className={
                      instruction.includes('MOV') ? 'text-blue-400' :
                      instruction.includes('ADD') || instruction.includes('SUB') ? 'text-yellow-400' :
                      instruction.includes('CMP') || instruction.includes('JMP') ? 'text-purple-400' :
                      instruction.includes('PUSH') || instruction.includes('POP') ? 'text-pink-400' :
                      instruction.includes('CALL') || instruction.includes('RET') ? 'text-red-400' :
                      'text-gray-300'
                    }>
                      {instruction}
                    </div>
                    {idx <= currentIndex && (
                      <div className="ml-auto text-green-400 text-sm">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Current Instruction */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Current Instruction</h4>
            {targetCode.instructions[currentIndex] && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-red-500/30">
                  <div className="text-xl font-mono font-bold text-white">
                    {targetCode.instructions[currentIndex]}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 p-3 rounded text-center">
                    <div className="text-xs text-gray-400 mb-1">Step</div>
                    <div className="text-lg font-bold">
                      {currentIndex + 1}<span className="text-gray-500">/{targetCode.instructions.length}</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded text-center">
                    <div className="text-xs text-gray-400 mb-1">Opcode</div>
                    <div className="text-lg font-semibold text-yellow-300">
                      {targetCode.instructions[currentIndex].split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Register Allocation */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Register Allocation</h4>
            <div className="grid grid-cols-2 gap-3">
              {targetCode.registers.map((register, idx) => (
                <div key={idx} className="bg-gray-800 p-3 rounded text-center">
                  <div className="font-mono text-lg text-purple-300">{register}</div>
                  <div className="text-xs text-gray-400 mt-1">Available</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Architecture</div>
          <div className="text-lg font-bold">{targetCode.architecture}</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Instructions</div>
          <div className="text-lg font-bold">{targetCode.instructions.length}</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Registers Used</div>
          <div className="text-lg font-bold">{targetCode.registers.length}</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Code Size</div>
          <div className="text-lg font-bold">{targetCode.instructions.length * 4} bytes</div>
        </div>
      </div>
    </div>
  );
}