import c from "../languages/c/index.js";
import java from "../languages/java/index.js";
import cpp from "../languages/cpp/index.js";
import csharp from "../languages/csharp/index.js";

import { analyze, generateIR } from "../core/index.js";
import { optimizeIR } from "../core/optimizer/irOptimizer.js";
import { generateTargetCode } from "../core/codegen/targetCodeGenerator.js";

const languages = {
  c,
  java,
  cpp,
  csharp,
};

export function compile({ code, language }) {
  const lang = languages[language];

  if (!lang) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // Lexical Analysis
  const tokens = lang.lexer(code);

  // Syntax Analysis
  const ast = lang.parser(tokens);

  // Semantic Analysis
  const semantic = analyze(ast);

  if (semantic.errors && semantic.errors.length > 0) {
    return {
      stages: {
        lexical: { tokens },
        syntax: { ast },
        semantic,
      },
    };
  }

  // IR Generation
  const ir = generateIR(ast);

  // IR Optimization
  const optimization = optimizeIR(ir.three_address_code ?? ir);

  // Target Code Generation
  const target_code = generateTargetCode(optimization.after);

  return {
    stages: {
      lexical: { tokens },
      syntax: { ast },
      semantic,
      ir: { three_address_code: ir },
      optimization,
      target_code,
    },
  };
}
