import { AST_TYPES } from "../../core/ast/astTypes.js";

let tokens = [];
let pos = 0;

export function parser(tokenList) {
  tokens = tokenList;
  pos = 0;
  return parseProgram();
}

/* ---------- Program ---------- */

function parseProgram() {
  consume("KEYWORD", "class");
  const className = consume("IDENTIFIER").value;
  consume("SYMBOL", "{");

  const methods = [];
  while (!check("SYMBOL", "}")) {
    methods.push(parseMainMethod());
  }

  consume("SYMBOL", "}");

  return {
    type: AST_TYPES.PROGRAM,
    body: [
      {
        type: "ClassDeclaration",
        name: className,
        methods,
      },
    ],
  };
}

/* ---------- Main Method ---------- */

function parseMainMethod() {
  consume("KEYWORD", "public");
  consume("KEYWORD", "static");
  consume("KEYWORD", "void");
  consume("KEYWORD", "main");

  consume("SYMBOL", "(");

  // 🔥 FIX: parse parameters if present
  let parameters = [];
  if (!check("SYMBOL", ")")) {
    parameters = parseParameters();
  }

  consume("SYMBOL", ")");
  consume("SYMBOL", "{");

  const body = [];
  while (!check("SYMBOL", "}")) {
    body.push(parseVariableDeclaration());
  }

  consume("SYMBOL", "}");

  return {
    type: "MethodDeclaration",
    name: "main",
    parameters,
    body,
  };
}

/* ---------- Parameters ---------- */

function parseParameters() {
  const params = [];

  // Only supporting: String[] args
  consume("KEYWORD", "String");
  consume("SYMBOL", "[");
  consume("SYMBOL", "]");
  const name = consume("IDENTIFIER").value;

  params.push({
    type: "Parameter",
    dataType: "String[]",
    name,
  });

  return params;
}

/* ---------- Statements ---------- */

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

/* ---------- Expressions ---------- */

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

  throw new Error("Java Parser Error: Invalid expression");
}

/* ---------- Helpers ---------- */

function match(type, value) {
  if (check(type, value)) {
    pos++;
    return true;
  }
  return false;
}

function consume(type, value) {
  if (check(type, value)) {
    return tokens[pos++];
  }
  throw new Error(`Expected ${value ?? type}`);
}

function check(type, value) {
  const token = tokens[pos];
  return token && token.type === type && (value ? token.value === value : true);
}

function previous() {
  return tokens[pos - 1];
}
