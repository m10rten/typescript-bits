import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

// ── ANSI helpers ─────────────────────────────────────────────────────────

const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
export const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

export const dim = (s: string) => `${DIM}${s}${RESET}`;
export const green = (s: string) => `${GREEN}${s}${RESET}`;
export const red = (s: string) => `${RED}${s}${RESET}`;
export const yellow = (s: string) => `${YELLOW}${s}${RESET}`;
export const bold = (s: string) => `${BOLD}${s}${RESET}`;

// ── Types ────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  hint: string;
}

export interface Options {
  modules: string[];
  outDir: string;
  srcDir: string | undefined;
  tag: string;
  all: boolean;
  dryRun: boolean;
  overwrite: boolean;
}

// ── Config (components.json) ─────────────────────────────────────────────

export function readConfigPath(cwd: string): string | undefined {
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

export function parseArgs(argv: string[], pkgVersion: string): Options {
  const args = argv.slice(2);
  const modules: string[] = [];
  let outDir: string | undefined;
  let srcDir: string | undefined;
  let tag = "main";
  let all = false;
  let dryRun = false;
  let overwrite = false;

  const defaultOut = readConfigPath(process.cwd()) ?? "src/lib/bits";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;

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

// ── Terminal safety ──────────────────────────────────────────────────────

const SHOW_CURSOR = "\x1b[?25h";

export function restoreTerminal(): void {
  try {
    if (process.stdin.isRaw) process.stdin.setRawMode(false);
  } catch {
    // Ignore — not in raw mode or already closed
  }
  try {
    process.stdout.write(SHOW_CURSOR);
  } catch {
    // stdout may already be closed
  }
}
