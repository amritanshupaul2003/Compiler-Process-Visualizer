export function generateTargetCode(optimizedIR) {
  let reg = 1;
  const instructions = [];

  for (const line of optimizedIR) {
    const [lhs, rhs] = line.split("=").map((s) => s.trim());

    if (!isNaN(rhs)) {
      instructions.push(`MOV R${reg}, #${rhs}`);
      instructions.push(`MOV ${lhs}, R${reg}`);
    } else {
      instructions.push(`MOV R${reg}, ${rhs}`);
      instructions.push(`MOV ${lhs}, R${reg}`);
    }

    reg++;
  }

  return {
    architecture: "generic-assembly",
    registers: Array.from({ length: reg - 1 }, (_, i) => `R${i + 1}`),
    instructions,
  };
}
