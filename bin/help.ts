import { dim, bold } from "./util.js";

// ── Module registry ──────────────────────────────────────────────────────

export interface ModuleInfo {
  desc: string;
  path: string;
}

export const MODULES: Record<string, ModuleInfo> = {
  atom: { desc: "Reactive state atom with subscriptions", path: "atom/src/index.ts" },
  json: { desc: "Rich JSON serialization with extended type support", path: "json/src/index.ts" },
  result: { desc: "Type-safe Result type (Ok/Err)", path: "result/src/index.ts" },
  safe: { desc: "Safe execution wrapper returning Results", path: "safe/src/index.ts" },
  types: { desc: "Utility types (Enumerate, Range)", path: "types/src/index.ts" },
  queue: { desc: "Event-driven queue with typed events", path: "queue/src/index.ts" },
  retry: { desc: "Retry utility with backoff strategies", path: "retry/src/index.ts" },
  reset: { desc: "TypeScript built-in type resets (unknown over any)", path: "reset/src/index.ts" },
};

// ── Help ─────────────────────────────────────────────────────────────────

export function printHelp(outDir: string): never {
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
