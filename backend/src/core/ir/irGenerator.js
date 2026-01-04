import { AST_TYPES } from "../ast/astTypes.js";

let tempCount = 0;

export function generateIR(ast) {
  const ir = [];
  tempCount = 0;

  traverse(ast);

  return {
    three_address_code: ir,
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
      const value = node.value;

      if (value.type === AST_TYPES.BIN_EXPR) {
        const temp = `t${tempCount++}`;
        ir.push(
          `${temp} = ${value.left.value ?? value.left.name} ${value.operator} ${
            value.right.value
          }`
        );
        ir.push(`${node.identifier} = ${temp}`);
      } else {
        ir.push(`${node.identifier} = ${value.value}`);
      }
    }
  }
}
