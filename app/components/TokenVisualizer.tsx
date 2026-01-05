'use client';

import { useState, useEffect } from 'react';
import { Token } from '@/types/compiler';

interface TokenVisualizerProps {
  tokens: Token[];
  speed: number;
}

const TOKEN_COLORS: { [key: string]: string } = {
  KEYWORD: 'bg-blue-500',
  IDENTIFIER: 'bg-green-500',
  SYMBOL: 'bg-purple-500',
  OPERATOR: 'bg-yellow-500',
  NUMBER: 'bg-red-500',
  STRING: 'bg-pink-500',
  COMMENT: 'bg-gray-500',
  ASSIGN: 'bg-orange-500',
  SEMICOLON: 'bg-indigo-500',
  EOF: 'bg-gray-700',
};

export default function TokenVisualizer({ tokens, speed }: TokenVisualizerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || tokens.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= tokens.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed / 2);

    return () => clearInterval(interval);
  }, [tokens, speed, isPlaying]);

  const handleTokenClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Lexical Analysis - Tokens</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsPlaying(!isPlaying);
            }}
            className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            ↻
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-900 rounded-lg font-mono">
        <div className="flex flex-wrap gap-2">
          {tokens.slice(0, currentIndex + 1).map((token, idx) => (
            <div
              key={idx}
              onClick={() => handleTokenClick(idx)}
              className={`${TOKEN_COLORS[token.type] || 'bg-gray-600'} 
                        px-3 py-1 rounded-lg cursor-pointer transform transition-transform 
                        ${idx === currentIndex ? 'scale-110 ring-2 ring-white' : ''}
                        hover:scale-105`}
            >
              <div className="text-xs font-semibold">{token.type}</div>
              <div className="font-bold">{token.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-400 mb-2">Current Token</h4>
          <div className="text-center">
            <div className={`${TOKEN_COLORS[tokens[currentIndex]?.type]} p-4 rounded-lg mb-2`}>
              <div className="text-2xl font-bold">{tokens[currentIndex]?.value}</div>
            </div>
            <div className="text-sm text-gray-300">{tokens[currentIndex]?.type}</div>
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-400 mb-2">Token Types</h4>
          <div className="space-y-2">
            {Object.entries(TOKEN_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${color} rounded`}></div>
                <span className="text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-400 mb-2">Statistics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Tokens:</span>
              <span className="font-semibold">{tokens.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Position:</span>
              <span className="font-semibold">{currentIndex + 1}/{tokens.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Progress:</span>
              <span className="font-semibold">
                {Math.round(((currentIndex + 1) / tokens.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}