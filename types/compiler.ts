export interface Token {
  type: string;
  value: string | number;
}

export interface ASTNode {
  type: string;
  [key: string]: string | number | ASTNode | ASTNode[];
}

export interface SemanticInfo {
  [key: string]: {
    type: string;
    initialized: boolean;
  };
}

export interface CompilationData {
  success: boolean;
  language: string;
  stages: {
    lexical: {
      tokens: Token[];
    };
    syntax: {
      ast: ASTNode;
    };
    semantic: {
      symbol_table: SemanticInfo;
      errors: string[];
    };
    ir: {
      three_address_code: {
        three_address_code: string[];
      };
    };
    optimization: {
      applied_passes: string[];
      before: string[];
      after: string[];
    };
    target_code: {
      architecture: string;
      registers: string[];
      instructions: string[];
    };
  };
}

export type CompilationStage = 'tokens' | 'ast' | 'semantic' | 'ir' | 'optimization' | 'target';