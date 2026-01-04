import { AST_TYPES } from "../../core/ast/astTypes.js";

let tokens = [];
let pos = 0;

export function parser(tokenList) {
  tokens = tokenList;
  pos = 0;
  return parseProgram();
}

function parseProgram() {
  consume("KEYWORD", "int");
  consume("KEYWORD", "main");
  consume("SYMBOL", "(");
  consume("SYMBOL", ")");
  consume("SYMBOL", "{");

  const body = [];
  while (!check("SYMBOL", "}")) {
    body.push(parseVariableDeclaration());
  }

  consume("SYMBOL", "}");

  return {
    type: AST_TYPES.PROGRAM,
    body,
  };
}

function parseVariableDeclaration() {
  consume("KEYWORD", "int");
  const identifier = consume("IDENTIFIER").value;
  consume("SYMBOL", "=");
  const value = parseExpression();
  consume("SYMBOL", ";");

  return {
    type: AST_TYPES.VAR_DECL,
    dataType: "int",
    identifier,
    value,
  };
}

function parseExpression() {
  let left = parseFactor();

  while (match("SYMBOL", "+")) {
    const right = parseFactor();
    left = {
      type: AST_TYPES.BIN_EXPR,
      operator: "+",
      left,
      right,
    };
  }

  return left;
}

function parseFactor() {
  if (match("NUMBER")) {
    return { type: AST_TYPES.LITERAL, value: previous().value };
  }

  if (match("IDENTIFIER")) {
    return { type: AST_TYPES.IDENTIFIER, name: previous().value };
  }

  throw new Error("C++ Parser Error: Invalid expression");
}

/* helpers */
function match(type, value) {
  if (check(type, value)) {
    pos++;
    return true;
  }
  return false;
}

function consume(type, value) {
  if (check(type, value)) return tokens[pos++];
  throw new Error(`Expected ${value ?? type}`);
}

function check(type, value) {
  const token = tokens[pos];
  return token && token.type === type && (!value || token.value === value);
}

function previous() {
  return tokens[pos - 1];
}
