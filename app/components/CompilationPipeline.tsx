'use client';

import { CompilationData, CompilationStage } from '@/types/compiler';

const PIPELINE_STAGES = [
  { id: 'lexer', label: 'Lexer', description: 'Tokenization', color: 'bg-blue-500' },
  { id: 'parser', label: 'Parser', description: 'AST Generation', color: 'bg-green-500' },
  { id: 'semantic', label: 'Semantic', description: 'Type Checking', color: 'bg-yellow-500' },
  { id: 'ir', label: 'IR Gen', description: 'Intermediate Code', color: 'bg-purple-500' },
  { id: 'optimizer', label: 'Optimizer', description: 'Code Optimization', color: 'bg-pink-500' },
  { id: 'codegen', label: 'CodeGen', description: 'Target Code', color: 'bg-red-500' },
];

interface CompilationPipelineProps {
  currentStage: CompilationStage;
  data: CompilationData | null;
}

export default function CompilationPipeline({ currentStage, data }: CompilationPipelineProps) {
  const getStageStatus = (stageId: string) => {
  const stageOrder = ['tokens', 'ast', 'semantic', 'ir', 'target'];
  const currentStageIndex = stageOrder.indexOf(currentStage);
  
  switch (stageId) {
    case 'lexer':
      return currentStageIndex >= 0 ? 'complete' : currentStage === 'tokens' ? 'active' : 'pending';
    case 'parser':
      return currentStageIndex >= 1 ? 'complete' : currentStage === 'ast' ? 'active' : 'pending';
    case 'semantic':
      return currentStageIndex >= 2 ? 'complete' : currentStage === 'semantic' ? 'active' : 'pending';
    case 'ir':
      return currentStageIndex >= 3 ? 'complete' : currentStage === 'ir' ? 'active' : 'pending';
    case 'optimizer':
      return currentStageIndex >= 3.5 ? 'complete' : currentStage === 'ir' ? 'active' : 'pending';
    case 'codegen':
      return currentStageIndex >= 4 ? 'complete' : currentStage === 'target' ? 'active' : 'pending';
    default:
      return 'pending';
  }
};

  return (
  <div className="w-full">
    <div className="flex justify-between mb-4">
      <h3 className="text-xl font-semibold">Compilation Pipeline</h3>
    </div>
    

    <div className="relative mb-8">
      <div className="flex items-center justify-between">

        {PIPELINE_STAGES.map((stage, index) => {
          const status = getStageStatus(stage.id);
          return (
            <div key={stage.id} className="flex flex-col items-center relative">

              <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10
                transition-all duration-300
                ${status === 'complete' ? `${stage.color} scale-110` : 
                  status === 'active' ? `${stage.color} animate-pulse ring-4 ${stage.color.replace('bg-', 'ring-')}/30` : 
                  'bg-gray-700'}`}
              >
                {status === 'complete' ? '✓' : index + 1}
              </div>
              

              <div className="mt-2 text-center w-16">
                <div className={`text-xs font-semibold
                  ${status === 'complete' ? 'text-white' : 
                    status === 'active' ? 'text-white' : 
                    'text-gray-500'}`}
                >
                  {stage.label}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {stage.description}
                </div>
              </div>
              

              {index < PIPELINE_STAGES.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-700 -z-10"
                  style={{ left: '50%' }}
                >
                  <div className={`h-0.5 ${status === 'complete' ? stage.color : 'bg-gray-700'} 
                    transition-all duration-500`}
                    style={{ width: status === 'complete' ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>


    {data && (
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">Compilation Metrics</h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Tokens</div>
            <div className="text-lg font-bold">{data.stages.lexical.tokens?.length || 0}</div>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="text-xs text-gray-400">IR Code</div>
            <div className="text-lg font-bold">{data.stages.ir.three_address_code.three_address_code?.length || 0}</div>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Symbols</div>
            <div className="text-lg font-bold">{Object.keys(data.stages.semantic.symbol_table || {}).length}</div>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="text-xs text-gray-400">Language</div>
            <div className="text-lg font-bold">{data.language?.toUpperCase()}</div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}