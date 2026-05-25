import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { createHighlighter, type Highlighter } from "shiki";

// process.cwd() = app/ during `next build`
// Turbopack ignore scopes the fs tracing to prevent NFT warnings
const SRC_DIR = join(/*turbopackIgnore: true*/ process.cwd(), "../src");

export interface ModuleExport {
  name: string;
  line: number;
}

export interface ModuleMeta {
  name: string;
  source: string;
  imports: string[];
  isReset: boolean;
  description: string;
  exports: ModuleExport[];
}

const descriptionFallback: Record<string, string> = {
  atom: "Reactive state atom with subscriptions",
  json: "Rich JSON serialization with extended type support",
  queue: "Event-driven queue with typed event system",
  result: "Type-safe Result type (Ok/Err)",
  retry: "Retry utility with configurable backoff strategies",
  safe: "Safe execution wrapper returning Results",
  types: "Utility types (Enumerate, Range)",
};

function extractImports(content: string): string[] {
  const imports: string[] = [];
  const regex = /(?:import|export)\s+.*?from\s+["'](\.[^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    imports.push(basename(match[1]!).replace(/\.js$/, ".ts"));
  }
  return imports;
}

function extractExports(source: string): ModuleExport[] {
  const exports: ModuleExport[] = [];
  const seen = new Set<string>();
  // Match export declarations: export function|class|interface|type|const|default|async function|function*
  const regex =
    /^\s*export\s+(?:(?:default|async)\s+)?(?:function(?:\s*\*)?|class|interface|type|const|enum|abstract\s+class)\s+(\w+)/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    const name = match[1]!;
    if (seen.has(name)) continue; // skip overloads — keep first declaration
    seen.add(name);
    const line = source.slice(0, match.index).split("\n").length;
    exports.push({ name, line });
  }
  return exports;
}

function extractDescription(content: string, name: string): string {
  const match = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*(?:\n|$)/);
  if (match?.[1]) return match[1].trim();
  const singleLine = content.match(/\/\*\*\s*(.+?)\s*\*\//);
  if (singleLine?.[1]) return singleLine[1].trim();
  return descriptionFallback[name] ?? name;
}

let _highlighter: Promise<Highlighter> | undefined;

async function getHighlighter(): Promise<Highlighter> {
  if (!_highlighter) {
    _highlighter = createHighlighter({ themes: ["github-dark"], langs: ["ts", "bash"] });
  }
  return _highlighter;
}

/** Returns highlighted HTML (<pre><code> wrapper) for a source string. */
export async function highlightCode(code: string, lang: "ts" | "bash" = "ts"): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code, { lang, theme: "github-dark" });
}

/**
 * Injects `id` (for export anchors) and `data-line` (for line numbering)
 * attributes into `<span class="line">` elements.
 */
export function addCodeAnchors(html: string, exports: ModuleExport[]): string {
  const lines = html.split("\n");
  const exportLines = new Map(exports.map((e) => [e.line, e.name]));
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    if (lines[i]!.includes('<span class="line">')) {
      const name = exportLines.get(lineNum);
      const attrs = name ? ` id="${name}" data-line="${lineNum}"` : ` data-line="${lineNum}"`;
      lines[i] = lines[i]!.replace('<span class="line">', `<span class="line"${attrs}>`);
    }
  }
  return lines.join("\n");
}

export function getModuleNames(): string[] {
  const names: string[] = [];
  const topEntries = readdirSync(SRC_DIR, { withFileTypes: true });
  for (const entry of topEntries) {
    if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts") {
      names.push(entry.name.replace(/\.ts$/, ""));
    }
  }
  const resetDir = join(SRC_DIR, "reset");
  const resetEntries = readdirSync(resetDir, { withFileTypes: true });
  for (const entry of resetEntries) {
    if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts") {
      names.push(`reset.${entry.name.replace(/\.ts$/, "")}`);
    }
  }
  return names;
}

export function getModuleContent(modulePath: string): ModuleMeta {
  const isReset = modulePath.startsWith("reset.");
  const filePath = isReset
    ? join(SRC_DIR, "reset", `${modulePath.slice("reset.".length)}.ts`)
    : join(SRC_DIR, `${modulePath}.ts`);
  const source = readFileSync(filePath, "utf-8");
  const imports = extractImports(source);
  const description = extractDescription(source, modulePath);
  const exports = extractExports(source);
  return { name: modulePath, source, imports, isReset, description, exports };
}

export function getAllModules(): ModuleMeta[] {
  const modules = getModuleNames().map(getModuleContent);
  modules.sort((a, b) => {
    if (a.isReset !== b.isReset) return a.isReset ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
  return modules;
}
