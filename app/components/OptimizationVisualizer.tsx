'use client';

import { useState, useEffect } from 'react';

interface OptimizationVisualizerProps {
  optimization: {
    applied_passes: string[];
    before: string[];
    after: string[];
  };
  speed: number;
}

export default function OptimizationVisualizer({ optimization, speed }: OptimizationVisualizerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showBefore, setShowBefore] = useState(true);

  useEffect(() => {
    if (!isPlaying || optimization.applied_passes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= optimization.applied_passes.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [optimization.applied_passes, speed, isPlaying]);

  // Toggle between before/after every few seconds
  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setShowBefore(prev => !prev);
    }, 2000);
    
    return () => clearInterval(toggleInterval);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Code Optimization</h3>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Optimization Passes */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Optimization Passes</h4>
            <div className="space-y-2">
              {optimization.applied_passes.map((pass, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg transition-all duration-300
                    ${idx === currentIndex 
                      ? 'bg-gradient-to-r from-orange-900/50 to-yellow-900/50 scale-[1.02] ring-2 ring-orange-400' 
                      : 'bg-gray-800/50'
                    }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3
                      ${idx <= currentIndex ? 'bg-orange-600' : 'bg-gray-700'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{pass}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {idx <= currentIndex ? '✓ Applied' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Pass Details */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">Current Optimization</h4>
            {optimization.applied_passes[currentIndex] && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-lg font-bold">{optimization.applied_passes[currentIndex]}</div>
                </div>
                <div className="text-sm text-gray-400">
                  {optimization.applied_passes[currentIndex].includes('Constant') ? 
                    'Replacing constant expressions with their computed values' :
                    optimization.applied_passes[currentIndex].includes('Propagation') ?
                    'Propagating constant values throughout the code' :
                    'Eliminating unnecessary temporary variables'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Before/After Comparison */}
        <div className="space-y-6">
          {/* Before/After Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`px-4 py-2 rounded-lg ${showBefore ? 'bg-blue-600' : 'bg-gray-700'}`}>
              Before Optimization
            </div>
            <div className="text-2xl">↔️</div>
            <div className={`px-4 py-2 rounded-lg ${!showBefore ? 'bg-green-600' : 'bg-gray-700'}`}>
              After Optimization
            </div>
          </div>

          {/* Code Comparison */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold text-gray-400 mb-3">
              {showBefore ? 'Original IR Code' : 'Optimized IR Code'}
            </h4>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
              <div className="space-y-2">
                {(showBefore ? optimization.before : optimization.after).map((line, idx) => (
                  <div key={idx} className="flex hover:bg-gray-800/50 px-2 py-1 rounded">
                    <div className="text-gray-500 w-8 shrink-0">{idx + 1}</div>
                    <div className="flex-1">
                      {showBefore ? (
                        <span className={line.includes('t') ? 'text-yellow-400' : 'text-gray-300'}>
                          {line}
                        </span>
                      ) : (
                        <span className={
                          line.includes('undefined') ? 'text-red-400' :
                          line === optimization.before[idx] ? 'text-gray-300' :
                          'text-green-400'
                        }>
                          {line}
                          {line !== optimization.before[idx] && (
                            <span className="ml-2 text-xs text-green-500">← Optimized</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optimization Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Instructions Reduced</div>
              <div className="text-xl font-bold text-green-400">
                {optimization.before.length - optimization.after.length}
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Temporaries Eliminated</div>
              <div className="text-xl font-bold text-yellow-400">
                {optimization.before.filter(l => l.includes('t')).length - 
                 optimization.after.filter(l => l.includes('t')).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}