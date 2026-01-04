export function lexer(code) {
  const tokens = [];
  let i = 0;

  const keywords = ["class", "static", "void", "Main", "int", "string"];

  while (i < code.length) {
    const ch = code[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let value = "";
      while (/[a-zA-Z0-9_]/.test(code[i])) {
        value += code[i++];
      }
      tokens.push({
        type: keywords.includes(value) ? "KEYWORD" : "IDENTIFIER",
        value,
      });
      continue;
    }

    if (/\d/.test(ch)) {
      let value = "";
      while (/\d/.test(code[i])) {
        value += code[i++];
      }
      tokens.push({ type: "NUMBER", value: Number(value) });
      continue;
    }

    if ("{}();=+[]".includes(ch)) {
      tokens.push({ type: "SYMBOL", value: ch });
      i++;
      continue;
    }

    throw new Error(`C# Lexer Error: Unknown character '${ch}'`);
  }

  tokens.push({ type: "EOF" });
  return tokens;
}
