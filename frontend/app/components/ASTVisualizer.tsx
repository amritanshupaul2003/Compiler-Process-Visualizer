'use client';

import { useState, useEffect, useMemo } from 'react';
import { ASTNode } from '@/types/compiler';

interface ASTVisualizerProps {
  ast: ASTNode;
  speed: number;
}

interface TreeNodeProps {
  node: ASTNode;
  level: number;
  isHighlighted: boolean;
}

const TreeNode = ({ node, level, isHighlighted }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!node) return null;

  const indent = level * 24;

  return (
    <div className="ml-6">
      <div 
        className={`flex items-center py-2 px-3 rounded-lg transition-all duration-300
          ${isHighlighted ? 'bg-blue-900/50 ring-2 ring-blue-400' : 'bg-gray-700/50 hover:bg-gray-700'}`}
        style={{ marginLeft: `${indent}px` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-2">{isExpanded ? '▼' : '▶'}</div>
        <div className="font-semibold text-blue-300">{node.type}</div>
        {node.name && (
          <div className="ml-2 px-2 py-1 bg-green-900/50 rounded text-green-300">
            {String(node.name)}
          </div>
        )}
        {node.value !== undefined && (
          <div className="ml-2 px-2 py-1 bg-red-900/50 rounded text-red-300">
            {String(node.value)}
          </div>
        )}
        {node.operator && (
          <div className="ml-2 px-2 py-1 bg-yellow-900/50 rounded text-yellow-300">
            {String(node.operator)}
          </div>
        )}
      </div>
      
      {isExpanded && (
        <>
          {Object.entries(node).map(([key, value]) => {
            if (key === 'type' || value === null || value === undefined) return null;
            
            if (typeof value === 'object' && !Array.isArray(value)) {
              return <TreeNode key={key} node={value} level={level + 1} isHighlighted={false} />;
            }

            if (Array.isArray(value)) {
              return (
                <div key={key}>
                  {value.map((item: ASTNode, idx: number) => (
                    item && typeof item === 'object' ? (
                      <TreeNode key={`${key}-${idx}`} node={item} level={level + 1} isHighlighted={false} />
                    ) : null
                  ))}
                </div>
              );
            }

            if (typeof value !== 'object') {
              return (
                <div 
                  key={key}
                  className="flex items-center py-1 px-3 rounded ml-12 bg-gray-800/50"
                  style={{ marginLeft: `${indent + 48}px` }}
                >
                  <span className="text-gray-400 mr-2">{key}:</span>
                  <span className="text-gray-300">{String(value)}</span>
                </div> // Explicitly convert value to string for display
              );
            }
            
            return null;
          })}
        </>
      )}
    </div>
  );
};

// Define traverse outside the component or in useCallback if needed
const traverse = (node: ASTNode | null, path: string[] = []): string[] => {
  if (!node) return path;
  
  // Add current node
  path.push(path.length.toString());
  
  // Traverse children
  Object.values(node).forEach(value => {
    if (Array.isArray(value)) {
      value.forEach(child => {
        if (child && typeof child === 'object') {
          traverse(child, path);
        }
      });
    } else if (value && typeof value === 'object') {
      traverse(value, path);
    }
  });
  
  return path;
};

export default function ASTVisualizer({ ast, speed }: ASTVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Use useMemo for derived state
  const traversalPath = useMemo(() => traverse(ast), [ast]);

  // Effect to reset currentStep when traversalPath changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStep(0);
  }, [traversalPath]);

  // Animation timer
  useEffect(() => {
    if (!isPlaying || traversalPath.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= traversalPath.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [traversalPath, speed, isPlaying]);

  const highlightNode = (node: ASTNode, step: number): boolean => {
    // This is a simplified version - you'd implement actual node highlighting logic
    return step === currentStep;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Syntax Tree (AST)</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(true);
            }}
            className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            ↻
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>AST Traversal</span>
          <span>Step {currentStep + 1}/{traversalPath.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / traversalPath.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
        <TreeNode 
          node={ast} 
          level={0} 
          isHighlighted={highlightNode(ast, 0)}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-900 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-400 text-sm mb-1">Node Type</h4>
          <div className="text-lg font-semibold text-blue-300">{ast?.type}</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-400 text-sm mb-1">Depth</h4>
          <div className="text-lg font-semibold text-green-300">
            {traversalPath.length > 0 ? traversalPath.length : '0'} nodes
          </div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-400 text-sm mb-1">Language</h4>
          <div className="text-lg font-semibold text-yellow-300">{String(ast?.language || 'N/A')}</div>
        </div>
      </div>
    </div>
  );
}