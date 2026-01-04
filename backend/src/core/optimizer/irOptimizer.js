export function optimizeIR(threeAddressCode) {
  const constants = {};
  const optimized = [];

  for (const line of threeAddressCode) {
    if (line.includes("+")) {
      const [temp, expr] = line.split("=");
      const [a, b] = expr.split("+").map((s) => s.trim());

      if (!isNaN(a) && !isNaN(b)) {
        constants[temp.trim()] = Number(a) + Number(b);
      }
    } else {
      const [lhs, rhs] = line.split("=").map((s) => s.trim());

      if (constants[rhs] !== undefined) {
        optimized.push(`${lhs} = ${constants[rhs]}`);
        constants[lhs] = constants[rhs];
      } else {
        optimized.push(line);
      }
    }
  }

  return {
    applied_passes: [
      "Constant Folding (IR)",
      "Constant Propagation",
      "Temporary Elimination",
    ],
    before: threeAddressCode,
    after: optimized,
  };
}
