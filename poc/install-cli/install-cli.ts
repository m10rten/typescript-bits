#!/usr/bin/env tsx
/**
 * install-cli — Resolves dependencies from source imports and writes
 * the needed .ts files into the target project.
 *
 * Usage:
 *   tsx install-cli.ts <module...> [options]
 *
 * Examples:
 *   tsx install-cli.ts format-utils
 *   tsx install-cli.ts string-utils math-utils --out ./lib/utils
 *
 * The source directory is the single source of truth. This script reads
 * raw .ts files, parses their import statements, resolves the full
 * dependency graph, and writes every required file to disk.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Configuration ──────────────────────────────────────────────────────

const DEFAULT_SRC = resolve(__dirname, "../packages/my-utils/src");
const DEFAULT_OUT = "./vendor/my-utils";

interface Options {
  srcDir: string;
  outDir: string;
}

// ── Argument parsing ───────────────────────────────────────────────────

function parseArgs(argv: string[]): { modules: string[]; options: Options } {
  const args = argv.slice(2);
  const modules: string[] = [];
  let srcDir = DEFAULT_SRC;
  let outDir = DEFAULT_OUT;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--src" && args[i + 1]) {
      srcDir = resolve(args[++i]);
    } else if (args[i] === "--out" && args[i + 1]) {
      outDir = args[++i];
    } else {
      modules.push(args[i]);
    }
  }

  if (modules.length === 0) {
    console.error("Usage: install-cli.ts <module...> [--src <dir>] [--out <dir>]");
    console.error("");
    console.error("Modules: string-utils, math-utils, format-utils");
    console.error("--src:   Source directory (default: packages/my-utils/src)");
    console.error("--out:   Output directory (default: ./vendor/my-utils)");
    process.exit(1);
  }

  return { modules, options: { srcDir, outDir } };
}

// ── Dependency resolution ──────────────────────────────────────────────

/**
 * Extracts relative import targets from a .ts file's content.
 * Matches: import ... from "./something.js"  and  import ... from './something.js'
 */
function extractImports(content: string): string[] {
  const imports: string[] = [];
  const regex = /(?:import|export)\s+.*?from\s+["'](\.[^"']+)["']/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

/**
 * Resolves the full set of source files needed, starting from the
 * requested modules and walking transitive imports.
 */
function resolveDependencies(modules: string[], srcDir: string): Map<string, string> {
  const resolved = new Map<string, string>(); // fileName → content
  const visited = new Set<string>();
  const queue: string[] = modules.map((m) => `${m}.ts`);

  while (queue.length > 0) {
    const file = queue.shift()!;

    if (visited.has(file)) continue;
    visited.add(file);

    const filePath = join(srcDir, file);

    if (!existsSync(filePath)) {
      console.error(`Error: source file not found: ${filePath}`);
      process.exit(1);
    }

    const content = readFileSync(filePath, "utf-8");
    resolved.set(file, content);

    // Find imports and queue them
    const imports = extractImports(content);
    for (const imp of imports) {
      // "./string-utils.js" → "string-utils.ts"
      const importedFile = basename(imp).replace(/\.js$/, ".ts");
      if (!visited.has(importedFile)) {
        queue.push(importedFile);
      }
    }
  }

  return resolved;
}

// ── File writing ───────────────────────────────────────────────────────

function writeFiles(files: Map<string, string>, outDir: string): string[] {
  const written: string[] = [];

  // Sort so dependencies come before dependents (topological-ish)
  const sorted = [...files.entries()].sort(([a], [b]) => {
    if (a === "index.ts") return -1;
    if (b === "index.ts") return 1;
    return a.localeCompare(b);
  });

  mkdirSync(outDir, { recursive: true });

  for (const [name, content] of sorted) {
    const outPath = join(outDir, name);
    writeFileSync(outPath, content, "utf-8");
    written.push(outPath);
    console.log(`  ✓ ${outPath}`);
  }

  return written;
}

// ── Main ───────────────────────────────────────────────────────────────

function main() {
  const { modules, options } = parseArgs(process.argv);
  const { srcDir, outDir } = options;

  console.log(`Source:   ${srcDir}`);
  console.log(`Output:   ${outDir}`);
  console.log(`Modules:  ${modules.join(", ")}`);
  console.log("");

  const resolved = resolveDependencies(modules, srcDir);

  console.log(`Resolved ${resolved.size} file(s):`);
  const written = writeFiles(resolved, outDir);
  console.log("");
  console.log(`Done. ${written.length} file(s) written to ${outDir}/`);
}

main();
