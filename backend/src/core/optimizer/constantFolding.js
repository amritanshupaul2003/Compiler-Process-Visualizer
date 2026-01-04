import { AST_TYPES } from "../ast/astTypes.js";

export function constantFold(node) {
  if (node.type === AST_TYPES.BIN_EXPR) {
    const left = constantFold(node.left);
    const right = constantFold(node.right);

    if (left.type === AST_TYPES.LITERAL && right.type === AST_TYPES.LITERAL) {
      return {
        type: AST_TYPES.LITERAL,
        value: eval(`${left.value} ${node.operator} ${right.value}`),
      };
    }

    return { ...node, left, right };
  }

  return node;
}
