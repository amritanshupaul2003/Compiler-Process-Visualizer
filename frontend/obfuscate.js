// obfuscate.js
const JavaScriptObfuscator = import("javascript-obfuscator");
const fs = import("fs");
const path = import("path");

const obfuscationConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: "hexadecimal",
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ["rc4"],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: "function",
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
};

function obfuscateFile(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");

  // Skip if file is already obfuscated
  if (code.includes("debugProtection") || code.includes("0x")) {
    console.log(`Skipping ${filePath} - already obfuscated`);
    return;
  }

  try {
    const obfuscatedResult = JavaScriptObfuscator.obfuscate(
      code,
      obfuscationConfig
    );
    fs.writeFileSync(filePath, obfuscatedResult.getObfuscatedCode());
    console.log(`✓ Obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`✗ Failed to obfuscate ${filePath}:`, error.message);
  }
}

// Obfuscate specific critical files
const filesToObfuscate = [
  "./app/page.tsx",
  "./app/api/compile/route.ts",
  "./components/CodeEditor.tsx",
  "./utils/compiler.ts",
];

filesToObfuscate.forEach((file) => {
  if (fs.existsSync(file)) {
    obfuscateFile(file);
  }
});
