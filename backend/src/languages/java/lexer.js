export function lexer(code) {
  const tokens = [];
  let i = 0;

  const keywords = [
    "class",
    "public",
    "static",
    "void",
    "main",
    "int",
    "String",
  ];

  while (i < code.length) {
    const ch = code[i];


    if (/\s/.test(ch)) {
      i++;
      continue;
    }


    if (/[a-zA-Z_]/.test(ch)) {
      let value = "";
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        value += code[i];
        i++;
      }

      tokens.push({
        type: keywords.includes(value) ? "KEYWORD" : "IDENTIFIER",
        value,
      });
      continue;
    }


    if (/\d/.test(ch)) {
      let value = "";
      while (i < code.length && /\d/.test(code[i])) {
        value += code[i];
        i++;
      }

      tokens.push({
        type: "NUMBER",
        value: Number(value),
      });
      continue;
    }


    if ("{}();=+[],".includes(ch)) {
      tokens.push({
        type: "SYMBOL",
        value: ch,
      });
      i++;
      continue;
    }


    throw new Error(`Java Lexer Error: Unknown character '${ch}'`);
  }


  tokens.push({ type: "EOF" });

  return tokens;
}
