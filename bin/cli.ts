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
import { createInterface } from "node:readline";

import { dim, green, red, bold, readConfigPath, parseArgs, restoreTerminal } from "./util.js";
import type { SelectOption, Options } from "./util.js";
import { MODULES, printHelp } from "./help.js";
import { multiSelect } from "./select.js";

// ── GitHub source ────────────────────────────────────────────────────────

const REPO = "m10rten/typescript-bits";
const SRC_PREFIX = "packages";
const GITHUB_RAW = (tag: string, path: string) =>
  `https://raw.githubusercontent.com/${REPO}/${tag}/${SRC_PREFIX}/${path}`;

function formatFetchUrl(path: string, opts: Options): string {
  return opts.srcDir ? join(opts.srcDir, path) : GITHUB_RAW(opts.tag, path);
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

    const sourceUrl = formatFetchUrl(filePath, options);
    process.stdout.write(`  ${options.srcDir ? "Reading" : "Fetching"} ${dim(sourceUrl)}...`);
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

// ── Overwrite confirmation ───────────────────────────────────────────────

async function confirmOverwrite(filePath: string): Promise<boolean> {
  if (!process.stdout.isTTY) return false;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise<boolean>((resolve) => {
    rl.question(`  Overwrite ${filePath}? [y/N] `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

// ── File writing ─────────────────────────────────────────────────────────

async function writeFiles(files: ResolvedFile[], outDir: string, dryRun: boolean, overwrite: boolean): Promise<void> {
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

    if (!existsSync(outPath)) {
      writeFileSync(outPath, file.content, "utf-8");
      console.log(`  ${green("✓")} ${outPath}`);
      continue;
    }

    const existing = readFileSync(outPath, "utf-8");
    if (existing === file.content) {
      console.log(`  ${dim("=")} ${outPath}  ${dim("(unchanged)")}`);
      continue;
    }

    if (overwrite) {
      writeFileSync(outPath, file.content, "utf-8");
      console.log(`  ${green("✓")} ${outPath}`);
    } else {
      const ok = await confirmOverwrite(outPath);
      if (ok) {
        writeFileSync(outPath, file.content, "utf-8");
        console.log(`  ${green("✓")} ${outPath}`);
      } else {
        console.log(`  ${dim("−")} ${outPath}  ${dim("(skipped)")}`);
      }
    }
  }
}

// Register terminal cleanup for all exit paths
process.on("exit", restoreTerminal);
process.on("SIGINT", () => process.exit(130));
process.on("SIGTERM", () => process.exit(143));

// ── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    let pkgDir = dirname(fileURLToPath(import.meta.url));
    while (!existsSync(join(pkgDir, "package.json")) && pkgDir !== resolve(pkgDir, "..")) {
      pkgDir = resolve(pkgDir, "..");
    }
    const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf-8")) as Record<string, unknown>;
    const pkgVersion = typeof pkg.version === "string" ? pkg.version : "0.0.0";

    // Handle --help / --version before parseArgs
    const rawArgs = process.argv.slice(2);
    const defaultOut = readConfigPath(process.cwd()) ?? "src/lib/bits";
    if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
      printHelp(defaultOut);
    }

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
    await writeFiles(files, opts.outDir, opts.dryRun, opts.overwrite);

    if (!opts.dryRun) {
      console.log(`\n${green("Done!")} Files in ${opts.outDir}/\n`);
    }
  } catch (err) {
    restoreTerminal();
    const message = err && typeof err === "object" && "message" in err ? (err as Error).message : String(err);
    console.error(`\n${red("Error:")} ${message}`);
    process.exit(1);
  }
}

main();
