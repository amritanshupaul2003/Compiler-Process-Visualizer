'use client';

import { useState, useEffect, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import CompilationPipeline from './components/CompilationPipeline';
import TokenVisualizer from './components/TokenVisualizer';
import ASTVisualizer from './components/ASTVisualizer';
import SemanticVisualizer from './components/SemanticVisualizer';
import IRVisualizer from './components/IRVisualizer';
import ProgressStepper from './components/ProgressStepper';
import OptimizationVisualizer from './components/OptimizationVisualizer';
import TargetCodeVisualizer from './components/TargetCodeVisualizer';
import { CompilationData, CompilationStage } from '@/types/compiler';

const LANGUAGES = ['csharp', 'cpp', 'java', 'c'] as const;
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function Home() {
  const [code, setCode] = useState<string>('int a = 10 + 20;');
  const [language, setLanguage] = useState<string>('c');
  const [compilationData, setCompilationData] = useState<CompilationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<CompilationStage>('tokens');
  const [animationSpeed, setAnimationSpeed] = useState<number>(500);
  const [error, setError] = useState<string | null>(null);
  const [isStageAnimating, setIsStageAnimating] = useState(false); // Track stage progression
  const [isComponentAnimating, setIsComponentAnimating] = useState(true); // Track component animation
  const stageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const compileCode = async () => {
    setLoading(true);
    setError(null);
    setCompilationData(null);
    setIsStageAnimating(true); // Start stage progression
    setIsComponentAnimating(true); // Start component animation
    
    try {
      const response = await fetch(`${API_URL}/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code, 
          language,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Compilation failed');
      }
      
      setCompilationData(data);
      
      // Clear any existing timeout
      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current);
      }
      
      // Start with first stage
      setCurrentStage('tokens');
      
      // Function to move to next stage
      const moveToNextStage = (currentStageIndex: number) => {
        if (!isStageAnimating) return; // Stop if stage animation is paused
        
        const stages: CompilationStage[] = ['tokens', 'ast', 'semantic', 'ir', 'optimization', 'target'];
        
        if (currentStageIndex < stages.length - 1) {
          stageTimeoutRef.current = setTimeout(() => {
            setCurrentStage(stages[currentStageIndex + 1]);
            moveToNextStage(currentStageIndex + 1);
          }, animationSpeed * 4); // Longer delay between stages
        } else {
          // Last stage reached
          setTimeout(() => {
            setIsStageAnimating(false); // Stop stage progression
          }, 500);
        }
      };
      
      // Start stage progression
      moveToNextStage(0);
      
    } catch (error) {
      console.error('Compilation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to compile code');
      setIsStageAnimating(false);
      setIsComponentAnimating(false);
    } finally {
      setLoading(false);
    }
  };

  // Toggle stage progression
  const toggleStageAnimation = () => {
    setIsStageAnimating(!isStageAnimating);
    
    if (!isStageAnimating && compilationData) {
      // Resume stage progression
      const stages: CompilationStage[] = ['tokens', 'ast', 'semantic', 'ir', 'optimization', 'target'];
      const currentStageIndex = stages.indexOf(currentStage);
      
      if (currentStageIndex < stages.length - 1) {
        if (stageTimeoutRef.current) {
          clearTimeout(stageTimeoutRef.current);
        }
        
        stageTimeoutRef.current = setTimeout(() => {
          setCurrentStage(stages[currentStageIndex + 1]);
          const moveToNextStage = (index: number) => {
            if (!isStageAnimating) return;
            
            if (index < stages.length - 1) {
              stageTimeoutRef.current = setTimeout(() => {
                setCurrentStage(stages[index + 1]);
                moveToNextStage(index + 1);
              }, animationSpeed * 4);
            } else {
              setIsStageAnimating(false);
            }
          };
          moveToNextStage(currentStageIndex + 1);
        }, animationSpeed * 4);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current);
      }
    };
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    const examples = {
      csharp: 'class Program {\n  static void Main(string[] args) {\n    int a = 10 + 20;\n  }\n}',
      cpp: 'int main() {\n  int a = 5 + 3;\n  int b = a + 2;\n}',
      java: 'class Main {\n  public static void main(String[] args) {\n    int a = 5 + 3;\n  }\n}',
      c: 'int a = 5 + 3;\nint b = a;'
    };
    setCode(examples[e.target.value as keyof typeof examples] || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Compiler Visualization
        </h1>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-300">Compilation Error</h3>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Code Editor</h2>
              <div className="flex gap-4">
                <select 
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
                <button
                  onClick={compileCode}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                           text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Compiling...
                    </span>
                  ) : 'Compile & Visualize'}
                </button>
              </div>
            </div>
            
            <CodeEditor 
              code={code} 
              onChange={setCode}
              language={language}
            />
            
            <div className="mt-4">
              <label className="block text-gray-300 mb-2">Animation Speed</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>Fast</span>
                <span>{animationSpeed}ms</span>
                <span>Slow</span>
              </div>
            </div>
          </div>

          {/* Stage Control */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Stage Progression Control</h3>
              <button
                onClick={toggleStageAnimation}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isStageAnimating 
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {isStageAnimating ? '⏸️ Pause Stages' : '▶️ Resume Stages'}
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Current Stage: <span className="text-blue-300 font-semibold capitalize">{currentStage}</span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Stage Progression: <span className={isStageAnimating ? 'text-green-400' : 'text-yellow-400'}>
                {isStageAnimating ? 'Running' : 'Paused'}
              </span>
            </p>
            <CompilationPipeline currentStage={currentStage} data={compilationData}/>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <ProgressStepper 
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
              isAnimating={isStageAnimating}
            />
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-400">Compiling with your API...</p>
                  <p className="text-sm text-gray-500 mt-2">Connecting to {API_URL}</p>
                </div>
              </div>
            ) : !compilationData ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-5xl mb-4">⚙️</div>
                  <p className="text-gray-400">Compile code to see visualization</p>
                </div>
              </div>
            ) : (
              <>
                {currentStage === 'tokens' && (
                  <TokenVisualizer 
                    tokens={compilationData.stages.lexical.tokens}
                    speed={animationSpeed}
                  />
                )}
                {currentStage === 'ast' && (
                  <ASTVisualizer 
                    ast={compilationData.stages.syntax.ast}
                    speed={animationSpeed}
                  />
                )}
                {currentStage === 'semantic' && (
                  <SemanticVisualizer 
                    semantic={compilationData.stages.semantic.symbol_table}
                    speed={animationSpeed}
                  />
                )}
                {currentStage === 'ir' && (
                  <IRVisualizer 
                    ir={compilationData.stages.ir.three_address_code.three_address_code}
                    speed={animationSpeed}
                  />
                )}
                {currentStage === 'optimization' && compilationData && (
                  <OptimizationVisualizer 
                    optimization={compilationData.stages.optimization}
                    speed={animationSpeed}
                  />
                )}
                {currentStage === 'target' && compilationData && (
                  <TargetCodeVisualizer 
                    targetCode={compilationData.stages.target_code}
                    ir={compilationData.stages.ir.three_address_code.three_address_code}
                    speed={animationSpeed}
                    language={compilationData.language}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-lg">
          <div className={`w-2 h-2 rounded-full mr-2 ${compilationData ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-sm text-gray-400">
            Build by Amritanshu Paul
          </span>
        </div>
      </div>
    </div>
  );
}