#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { listModules, resolveDependencies } from "./copy-resolver.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// From dist/scripts/install.js → go up 2 levels to package root, then into src/
const DEFAULT_SRC = resolve(__dirname, "..", "..", "src");
const DEFAULT_OUT = resolve(process.cwd(), "vendor", "copy-install");

interface Args {
  modules: string[];
  outDir: string;
  srcDir: string;
  dryRun: boolean;
  list: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    modules: [],
    outDir: DEFAULT_OUT,
    srcDir: DEFAULT_SRC,
    dryRun: false,
    list: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--out" && argv[i + 1]) {
      args.outDir = resolve(argv[++i]!);
    } else if (arg === "--src" && argv[i + 1]) {
      args.srcDir = resolve(argv[++i]!);
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "list") {
      args.list = true;
    } else if (!arg.startsWith("-")) {
      args.modules.push(arg);
    }
  }

  return args;
}

function generateIndex(files: string[]): string {
  const exports = files
    .map((f) => {
      const name = basename(f).replace(/\.tsx?$/, "");
      return `export * from "./${name}.js";`;
    })
    .join("\n");
  return `${exports}\n`;
}

function generateReadme(modules: string[], srcDir: string): string {
  const available = listModules(srcDir).join(", ");
  return `# Installed Modules

Copied via: \`npx copy-install install ${modules.join(" ")}\`

## Installed

${modules.map((m) => `- \`${m}.ts\``).join("\n")}

## Available Modules

${available}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.list) {
    const modules = listModules(args.srcDir);
    console.log("Available modules:");
    modules.forEach((m) => console.log(`  ${m}`));
    return;
  }

  if (args.modules.length === 0) {
    console.error("Usage: copy-install install <module...> [options]");
    console.error("  --out <dir>      Output directory (default: ./vendor/copy-install)");
    console.error("  --src <dir>      Source directory (default: package src/)");
    console.error("  --dry-run        Show what would be copied without writing");
    console.error("  list             List available modules");
    process.exit(1);
  }

  // Resolve all dependencies for all requested modules
  const allFiles = new Set<string>();
  for (const mod of args.modules) {
    const deps = resolveDependencies(mod, args.srcDir);
    deps.forEach((f) => allFiles.add(f));
  }

  const files = [...allFiles];

  if (args.dryRun) {
    console.log("Would copy the following files:");
    files.forEach((f) => console.log(`  ${f}`));
    console.log(`\nOutput directory: ${args.outDir}`);
    return;
  }

  // Create output directory
  mkdirSync(args.outDir, { recursive: true });

  // Copy each file
  for (const srcPath of files) {
    const destPath = join(args.outDir, basename(srcPath));
    const content = readFileSync(srcPath, "utf-8");
    writeFileSync(destPath, content);
    console.log(`Copied: ${basename(srcPath)}`);
  }

  // Generate index.ts
  const indexPath = join(args.outDir, "index.ts");
  writeFileSync(indexPath, generateIndex(files));
  console.log("Generated: index.ts");

  // Generate README.md
  const readmePath = join(args.outDir, "README.md");
  writeFileSync(readmePath, generateReadme(args.modules, args.srcDir));
  console.log("Generated: README.md");

  console.log(`\nInstalled ${files.length} file(s) to ${args.outDir}`);
}

main();
