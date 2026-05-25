#!/usr/bin/env node

/**
 * typescript-bits CLI — Copy individual modules as local source files.
 *
 * Source files are fetched from GitHub rather than bundled with the package.
 * Dependencies of requested modules are resolved and included automatically.
 *
 * Usage: npx typescript-bits <module...> [options]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { multiSelect, type SelectOption } from "./select.js";

// ── Module registry ──────────────────────────────────────────────────────

interface ModuleInfo {
  desc: string;
  path: string;
}

const MODULES: Record<string, ModuleInfo> = {
  atom: { desc: "Reactive state atom with subscriptions", path: "atom.ts" },
  json: { desc: "Rich JSON serialization with extended type support", path: "json.ts" },
  result: { desc: "Type-safe Result type (Ok/Err)", path: "result.ts" },
  safe: { desc: "Safe execution wrapper returning Results", path: "safe.ts" },
  types: { desc: "Utility types (Enumerate, Range)", path: "types.ts" },
  queue: { desc: "Event-driven queue with typed events", path: "queue.ts" },
  retry: { desc: "Retry utility with backoff strategies", path: "retry.ts" },
  reset: { desc: "TypeScript built-in type resets (unknown over any)", path: "reset/index.ts" },
};

// ── GitHub source ────────────────────────────────────────────────────────

const REPO = "m10rten/typescript-bits";
const SRC_PREFIX = "src";
const GITHUB_RAW = (tag: string, path: string) =>
  `https://raw.githubusercontent.com/${REPO}/${tag}/${SRC_PREFIX}/${path}`;

// ── ANSI helpers ─────────────────────────────────────────────────────────

const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const dim = (s: string) => `${DIM}${s}${RESET}`;
const green = (s: string) => `${GREEN}${s}${RESET}`;
const red = (s: string) => `${RED}${s}${RESET}`;
const bold = (s: string) => `\x1b[1m${s}${RESET}`;

// ── Options ──────────────────────────────────────────────────────────────

interface Options {
  modules: string[];
  outDir: string;
  srcDir: string | undefined;
  tag: string;
  all: boolean;
  dryRun: boolean;
  overwrite: boolean;
}

// ── Help ─────────────────────────────────────────────────────────────────

function printHelp(outDir: string): never {
  console.log(`
${bold("typescript-bits")} — Copy individual modules as local source files.

${bold("Usage:")}
  npx typescript-bits [${dim("module...")}] [${dim("options")}]

${bold("Arguments:")}
  module${"        "}Module name(s) to copy (omit for interactive picker)
${"               "}${dim("atom, json, result, safe, types, queue, retry, reset")}

${bold("Options:")}
  --path, -p <dir>  Output directory           ${dim(`(default: ${outDir})`)}
  --all, -a         Copy all available modules
  --dry-run         Preview without writing
  --overwrite       Overwrite existing files    ${dim("(default: prompt)")}
  --src <dir>       Source directory            ${dim("(dev: read local instead of fetch)")}
  --tag <ref>       GitHub tag/ref              ${dim("(dev: override version tag)")}
  --help            Show this message
  --version         Show version

${bold("Examples:")}
  npx typescript-bits atom
  npx typescript-bits atom json result
  npx typescript-bits reset
  npx typescript-bits --all
  npx typescript-bits atom --path vendor

${bold("Config:")}
  Add ${dim('"bits"')} to your ${dim("components.json")} aliases to customise the default path:
  ${dim('{ "aliases": { "bits": "src/lib/bits" } }')}
`);
  process.exit(0);
}

// ── Config (components.json) ─────────────────────────────────────────────

function readConfigPath(cwd: string): string | undefined {
  try {
    const configPath = join(cwd, "components.json");
    if (!existsSync(configPath)) return undefined;
    const config = JSON.parse(readFileSync(configPath, "utf-8")) as Record<string, unknown>;
    const aliases = config?.aliases as Record<string, unknown> | undefined;
    const bits = aliases?.bits;
    return typeof bits === "string" ? bits : undefined;
  } catch {
    return undefined;
  }
}

// ── Argument parsing ─────────────────────────────────────────────────────

function parseArgs(argv: string[], pkgVersion: string): Options {
  const args = argv.slice(2);
  const modules: string[] = [];
  let outDir: string | undefined;
  let srcDir: string | undefined;
  let tag = `v${pkgVersion}`;
  let all = false;
  let dryRun = false;
  let overwrite = false;

  const defaultOut = readConfigPath(process.cwd()) ?? "src/lib/bits";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;

    if (arg === "--help" || arg === "-h") printHelp(defaultOut);
    if (arg === "--version" || arg === "-v") {
      console.log(pkgVersion);
      process.exit(0);
    }
    if ((arg === "--path" || arg === "-p") && args[i + 1]) {
      outDir = args[++i]!;
      continue;
    }
    if (arg === "--src" && args[i + 1]) {
      srcDir = resolve(args[++i]!);
      continue;
    }
    if (arg === "--tag" && args[i + 1]) {
      tag = args[++i]!;
      continue;
    }
    if (arg === "--all" || arg === "-a") {
      all = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--overwrite") {
      overwrite = true;
      continue;
    }
    modules.push(arg);
  }

  return { modules, outDir: outDir ?? defaultOut, srcDir, tag, all, dryRun, overwrite };
}

// ── Source fetching ──────────────────────────────────────────────────────

async function readSource(path: string, options: Options): Promise<string> {
  if (options.srcDir) {
    const filePath = join(options.srcDir, path);
    if (!existsSync(filePath)) {
      console.error(`  ${red("✗")} Source not found: ${filePath}`);
      process.exit(1);
    }
    return readFileSync(filePath, "utf-8");
  }

  const url = GITHUB_RAW(options.tag, path);
  const res = await fetch(url);

  if (!res.ok) {
    const hint =
      res.status === 404
        ? `Module not found. Check the name and version tag (${options.tag}).`
        : res.status === 403
          ? "GitHub rate limit exceeded. Use --src for local files."
          : `HTTP ${res.status} ${res.statusText}`;
    console.error(`  ${red("✗")} Failed to fetch ${path}: ${hint}`);
    process.exit(1);
  }

  return res.text();
}

// ── Import extraction ────────────────────────────────────────────────────

function extractImports(content: string): string[] {
  const imports: string[] = [];
  const re = /(?:import|export)\s+.*?from\s+["'](\.[^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) imports.push(m[1]!);
  return imports;
}

// ── Dependency resolution ────────────────────────────────────────────────

interface ResolvedFile {
  path: string;
  content: string;
}

async function resolveDeps(moduleNames: string[], options: Options): Promise<ResolvedFile[]> {
  const resolved = new Map<string, string>();
  const visited = new Set<string>();
  const queue = moduleNames.map((name) => {
    const info = MODULES[name];
    if (!info) {
      console.error(`  ${red("✗")} Unknown module: "${name}". Available: ${Object.keys(MODULES).join(", ")}`);
      process.exit(1);
    }
    return info.path;
  });

  while (queue.length > 0) {
    const filePath = queue.shift()!;
    if (visited.has(filePath)) continue;
    visited.add(filePath);

    process.stdout.write(`  ${options.srcDir ? "Reading" : "Fetching"} ${filePath}...`);
    const content = await readSource(filePath, options);
    resolved.set(filePath, content);
    process.stdout.write(` ${green("✓")}\n`);

    const baseDir = filePath.includes("/") ? filePath.slice(0, filePath.lastIndexOf("/") + 1) : "";
    for (const imp of extractImports(content)) {
      const imported = baseDir + basename(imp).replace(/\.js$/, ".ts");
      if (!visited.has(imported)) queue.push(imported);
    }
  }

  return [...resolved.entries()].map(([path, content]) => ({ path, content }));
}

// ── File writing ─────────────────────────────────────────────────────────

function writeFiles(files: ResolvedFile[], outDir: string, dryRun: boolean, overwrite: boolean): void {
  files.sort((a, b) => {
    const an = basename(a.path);
    const bn = basename(b.path);
    if (an === "index.ts") return -1;
    if (bn === "index.ts") return 1;
    return a.path.localeCompare(b.path);
  });

  if (dryRun) {
    console.log(`\n${dim("Would write to")} ${bold(outDir)}${dim(":")}`);
    for (const f of files) console.log(`  ${outDir}/${f.path}`);
    console.log(`\n${dim("(dry run)")} ${files.length} file(s) would be written.`);
    return;
  }

  for (const file of files) {
    const outPath = join(outDir, file.path);
    mkdirSync(resolve(outPath, ".."), { recursive: true });

    if (existsSync(outPath) && !overwrite) {
      console.log(`  ${YELLOW}⚠${RESET} ${outPath}  ${dim("(skipped, exists)")}`);
      continue;
    }
    writeFileSync(outPath, file.content, "utf-8");
    console.log(`  ${green("✓")} ${outPath}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let pkgDir = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(pkgDir, "package.json")) && pkgDir !== resolve(pkgDir, "..")) {
    pkgDir = resolve(pkgDir, "..");
  }
  const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf-8")) as Record<string, unknown>;
  const pkgVersion = typeof pkg.version === "string" ? pkg.version : "0.0.0";

  const opts = parseArgs(process.argv, pkgVersion);

  let modules = opts.modules;
  if (opts.all) {
    modules = Object.keys(MODULES);
  } else if (modules.length === 0) {
    if (!process.stdout.isTTY) {
      console.error("No modules specified. Use --all or provide module names.");
      process.exit(1);
    }
    const selectOpts: SelectOption[] = Object.entries(MODULES).map(([name, info]) => ({
      value: name,
      label: name,
      hint: info.desc,
    }));
    modules = await multiSelect(selectOpts);
    if (modules.length === 0) {
      console.log("\nNo modules selected.");
      process.exit(0);
    }
  }

  const sourceLabel = opts.srcDir ?? `${REPO}@${opts.tag}`;
  console.log(`\n${dim("Source:")} ${sourceLabel}`);
  console.log(`${dim("Output:")} ${opts.outDir}`);
  console.log(`${dim("Modules:")} ${modules.join(", ")}\n`);

  const files = await resolveDeps(modules, opts);
  console.log(`\n${dim("Resolved")} ${files.length} file(s):`);
  writeFiles(files, opts.outDir, opts.dryRun, opts.overwrite);

  if (!opts.dryRun) {
    console.log(`\n${green("Done!")} ${files.length} file(s) written to ${opts.outDir}/\n`);
  }
}

main().catch((err) => {
  console.error(`\n${red("Error:")} ${err.message ?? err}`);
  process.exit(1);
});
