export function lexer(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    // Ignore whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Keywords / identifiers
    if (/[a-zA-Z_]/.test(ch)) {
      let value = "";
      while (/[a-zA-Z0-9_]/.test(code[i])) {
        value += code[i++];
      }

      tokens.push({
        type: value === "int" ? "KEYWORD" : "IDENTIFIER",
        value,
      });
      continue;
    }

    // Numbers
    if (/\d/.test(ch)) {
      let value = "";
      while (/\d/.test(code[i])) {
        value += code[i++];
      }

      tokens.push({
        type: "NUMBER",
        value: Number(value),
      });
      continue;
    }

    // Operators
    if ("+-*/".includes(ch)) {
      tokens.push({ type: "OPERATOR", value: ch });
      i++;
      continue;
    }

    // Assignment
    if (ch === "=") {
      tokens.push({ type: "ASSIGN", value: "=" });
      i++;
      continue;
    }

    // Semicolon
    if (ch === ";") {
      tokens.push({ type: "SEMICOLON", value: ";" });
      i++;
      continue;
    }

    throw new Error(`C Lexer Error: Unknown character '${ch}'`);
  }

  tokens.push({ type: "EOF" });
  return tokens;
}
