import { AST_TYPES } from "../ast/astTypes.js";

export function analyze(ast) {
  const symbolTable = {};
  const errors = []; // ✅ FIX: define errors

  traverse(ast);

  return {
    symbol_table: symbolTable,
    errors,
  };

  function traverse(node) {
    if (!node) return;

    // Program
    if (node.type === AST_TYPES.PROGRAM) {
      node.body.forEach(traverse);
    }

    // Class
    else if (node.type === "ClassDeclaration") {
      node.methods.forEach(traverse);
    }

    // Method
    else if (node.type === "MethodDeclaration") {
      node.body.forEach(traverse);
    }

    // Variable Declaration
    else if (node.type === AST_TYPES.VAR_DECL) {
      symbolTable[node.identifier] = {
        type: node.dataType,
        initialized: true,
      };
    }
  }
}
