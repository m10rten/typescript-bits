import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { createHighlighter, type Highlighter } from "shiki";

// process.cwd() = app/ during `next build`
// Turbopack ignore scopes the fs tracing to prevent NFT warnings
const SRC_DIR = join(/*turbopackIgnore: true*/ process.cwd(), "../src");

export interface ModuleExport {
  name: string;
  line: number;
}

export interface ModuleChild {
  name: string;
  description: string;
}

export interface ModuleMeta {
  name: string;
  source: string;
  imports: string[];
  description: string;
  exports: ModuleExport[];
  children?: ModuleChild[];
}

const descriptionFallback: Record<string, string> = {
  atom: "Reactive state atom with subscriptions",
  json: "Rich JSON serialization with extended type support",
  queue: "Event-driven queue with typed event system",
  reset: "TypeScript built-in type resets (unknown over any)",
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
    // Directories with index.ts are modules too (skip cli/ and _ prefixed dirs)
    if (entry.isDirectory() && entry.name !== "cli" && !entry.name.startsWith("_")) {
      const indexPath = join(SRC_DIR, entry.name, "index.ts");
      try {
        if (readFileSync(indexPath, "utf-8")) names.push(entry.name);
      } catch {
        // no index.ts — not a module
      }
    }
  }
  return names;
}

function scanChildren(modulePath: string): ModuleChild[] {
  const dirPath = join(SRC_DIR, modulePath);
  try {
    return readdirSync(dirPath, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts" && !entry.name.startsWith("_"),
      )
      .map((entry) => {
        const name = entry.name.replace(/\.ts$/, "");
        const childSource = readFileSync(join(dirPath, entry.name), "utf-8");
        return { name, description: extractDescription(childSource, name) };
      });
  } catch {
    return [];
  }
}

export function getModuleContent(modulePath: string): ModuleMeta {
  if (modulePath.startsWith("bin")) {
    throw new Error(`"${modulePath}" is not a library module`);
  }
  // Try direct file first (atom.ts, result.ts), then directory/index.ts (reset/index.ts)
  let filePath = join(SRC_DIR, `${modulePath}.ts`);
  let isDir = false;
  if (!existsSync(filePath)) {
    filePath = join(SRC_DIR, modulePath, "index.ts");
    isDir = true;
  }
  const source = readFileSync(filePath, "utf-8");
  const imports = extractImports(source);
  const description = extractDescription(source, modulePath);
  const exports = extractExports(source);
  const children = isDir ? scanChildren(modulePath) : undefined;
  return { name: modulePath, source, imports, description, exports, children };
}

export function getAllModules(): ModuleMeta[] {
  const modules = getModuleNames().map(getModuleContent);
  modules.sort((a, b) => a.name.localeCompare(b.name));
  return modules;
}
