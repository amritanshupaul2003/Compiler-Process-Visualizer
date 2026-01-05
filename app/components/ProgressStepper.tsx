'use client';

import { CompilationStage } from '@/types/compiler';

const STAGES = [
  { id: 'tokens', label: 'Lexical Analysis', icon: '🔤' },
  { id: 'ast', label: 'Syntax Analysis', icon: '🌳' },
  { id: 'semantic', label: 'Semantic Analysis', icon: '🔍' },
  { id: 'ir', label: 'IR Generation', icon: '⚙️' },
  { id: 'optimization', label: 'Optimization', icon: '🚀' },
  { id: 'target', label: 'Target Code', icon: '🎯' },
] as const;

interface ProgressStepperProps {
  currentStage: CompilationStage;
  setCurrentStage: (stage: CompilationStage) => void;
  isAnimating?: boolean;
}

export default function ProgressStepper({ 
  currentStage, 
  setCurrentStage,
  isAnimating = false
}: ProgressStepperProps) {
  const currentIndex = STAGES.findIndex(stage => stage.id === currentStage);
  const isComplete = currentIndex === STAGES.length - 1 && !isAnimating;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Compilation Stages</h3>
        {isComplete && (
          <div className="text-sm text-green-400 bg-green-900/30 px-3 py-1 rounded-full">
            ✓ Complete
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-700 -translate-y-1/2">
          <div 
            className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ 
              width: isComplete ? '100%' : `${(currentIndex / (STAGES.length - 1)) * 100}%` 
            }}
          ></div>
        </div>

        {/* Stage dots */}
        <div className="flex justify-between relative z-10">
          {STAGES.map((stage, index) => {
            const isPastStage = index < currentIndex;
            const isCurrentStage = index === currentIndex;
            const isCompleted = isPastStage || (isCurrentStage && isComplete);
            
            return (
              <div key={stage.id} className="flex flex-col items-center">
                <button
                  onClick={() => setCurrentStage(stage.id as CompilationStage)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
                    transition-all duration-300 transform hover:scale-110
                    ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-purple-500 scale-110 shadow-lg' : 
                      isCurrentStage ? 'bg-gradient-to-br from-blue-500 to-purple-500 scale-110 shadow-lg ring-4 ring-blue-500/30' : 
                      'bg-gray-700'
                    }`}
                >
                  {isCompleted ? '✓' : stage.icon}
                </button>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium transition-colors
                    ${isCompleted || isCurrentStage ? 'text-white' : 'text-gray-500'}`}
                  >
                    {stage.label}
                  </div>
                  <div className="text-xs mt-1">
                    {isCompleted ? (
                      <span className="text-green-400">✓ Completed</span>
                    ) : isCurrentStage ? (
                      <span className={`${isAnimating ? 'text-blue-400 animate-pulse' : 'text-green-400'}`}>
                        {isAnimating ? '● Processing' : '✓ Complete'}
                      </span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage description */}
      <div className="mt-8 p-4 bg-gray-900 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{STAGES[currentIndex].icon}</div>
          <div>
            <h4 className="font-semibold text-lg">{STAGES[currentIndex].label}</h4>
            <p className="text-gray-400 text-sm mt-1">
              {currentStage === 'tokens' && 'Breaking source code into tokens (keywords, identifiers, symbols, etc.)'}
              {currentStage === 'ast' && 'Building Abstract Syntax Tree to represent program structure'}
              {currentStage === 'semantic' && 'Checking types, scope, and semantic rules'}
              {currentStage === 'ir' && 'Generating intermediate code for optimization and code generation'}
              {currentStage === 'optimization' && 'Applying optimizations to improve code performance and size'}
              {currentStage === 'target' && 'Generating final machine code for the target architecture'}
            </p>
            {isComplete && (
              <div className="mt-3 p-2 bg-green-900/30 rounded text-sm">
                <span className="text-green-400">✓ All compilation stages completed successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}