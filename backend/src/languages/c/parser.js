import { AST_TYPES } from "../../core/ast/astTypes.js";

let tokens = [];
let pos = 0;

export function parser(tokenList) {
  tokens = tokenList;
  pos = 0;
  return parseProgram();
}

function parseProgram() {
  const body = [];
  while (!match("EOF")) {
    body.push(parseDeclaration());
  }
  return {
    type: AST_TYPES.PROGRAM,
    body,
  };
}

function parseDeclaration() {
  consume("KEYWORD", "int");
  const identifier = consume("IDENTIFIER").value;
  consume("ASSIGN");
  const value = parseExpression();
  consume("SEMICOLON");

  return {
    type: AST_TYPES.VAR_DECL,
    dataType: "int",
    identifier,
    value,
  };
}

function parseExpression() {
  let left = parseTerm();

  while (match("OPERATOR", "+") || match("OPERATOR", "-")) {
    const operator = previous().value;
    const right = parseTerm();
    left = {
      type: AST_TYPES.BIN_EXPR,
      operator,
      left,
      right,
    };
  }

  return left;
}

function parseTerm() {
  let left = parseFactor();

  while (match("OPERATOR", "*") || match("OPERATOR", "/")) {
    const operator = previous().value;
    const right = parseFactor();
    left = {
      type: AST_TYPES.BIN_EXPR,
      operator,
      left,
      right,
    };
  }

  return left;
}

function parseFactor() {
  if (match("NUMBER")) {
    return {
      type: AST_TYPES.LITERAL,
      value: previous().value,
    };
  }

  if (match("IDENTIFIER")) {
    return {
      type: AST_TYPES.IDENTIFIER,
      name: previous().value,
    };
  }

  throw new Error("C Parser Error: Invalid expression");
}


function match(type, value) {
  if (check(type, value)) {
    pos++;
    return true;
  }
  return false;
}

function consume(type, value) {
  if (check(type, value)) return tokens[pos++];
  throw new Error(`Expected ${type}`);
}

function check(type, value) {
  const token = tokens[pos];
  return token && token.type === type && (value ? token.value === value : true);
}

function previous() {
  return tokens[pos - 1];
}
