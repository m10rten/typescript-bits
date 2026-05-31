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

export interface ModuleExample {
  /** Name of the export this example documents */
  name: string;
  /** The example code content (without markdown fences) */
  code: string;
}

export interface ModuleMeta {
  name: string;
  source: string;
  /** Source with @example JSDoc sections removed (for "Copy Source" view) */
  sourceClean: string;
  imports: string[];
  description: string;
  exports: ModuleExport[];
  /** Export info derived from `sourceClean` (line numbers shifted) */
  exportsClean: ModuleExport[];
  /** Import path for use in docs (e.g. "typescript-bits/atom") */
  importPath: string;
  /** Usage examples extracted from @example JSDoc tags */
  examples: ModuleExample[];
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
    /^\s*export\s+(?:(?:default|async)\s+)?(?:function(?:\s*\*)?|class|interface|type|const|enum|abstract\s+class|namespace)\s+(\w+)/gm;
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

/**
 * Removes `@example` sections (including description + code fence) from JSDoc
 * comments, preserving the rest of the doc comment. Used to produce a clean
 * source for the "Copy Source" view.
 */
export function stripExampleBlocks(source: string): string {
  const lines = source.split("\n");
  const result: string[] = [];
  let inExample = false;

  for (const line of lines) {
    // Strip JSDoc line prefix to check if this line starts @example
    const docContent = line.replace(/^\s*\*\s?/, "");

    if (docContent.startsWith("@example")) {
      inExample = true;
      continue;
    }

    if (inExample) {
      if (line.includes("*/")) {
        inExample = false;
        result.push(line);
      }
      continue;
    }

    result.push(line);
  }

  return result.join("\n");
}

/**
 * Concatenates usage examples into a single code string, with `// ExportName`
 * comments separating each example block.
 */
export function concatExampleCode(examples: ModuleExample[]): string {
  return examples.map((ex) => `// ${ex.name}\n${ex.code}`).join("\n\n");
}

/**
 * Scans the source for JSDoc `/** @example ... *&#47;` blocks and extracts the
 * code-fenced content that immediately precedes each export declaration.
 * Returns one entry per `@example` code block, keyed by export name.
 */
function extractExamples(source: string, exports: ModuleExport[]): ModuleExample[] {
  const examples: ModuleExample[] = [];
  const exportLines = new Map(exports.map((e) => [e.line, e.name]));
  const lines = source.split("\n");

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i]!.trim();

    if (trimmed.startsWith("/**")) {
      // Collect the full JSDoc block
      const jsdocLines: string[] = [lines[i]!];
      let endIdx = i;
      i++;
      while (i < lines.length && !lines[i]!.includes("*/")) {
        jsdocLines.push(lines[i]!);
        i++;
      }
      if (i < lines.length) {
        jsdocLines.push(lines[i]!);
        endIdx = i;
      }

      // Find the next non-blank line after the JSDoc
      let nextLine = endIdx + 1;
      while (nextLine < lines.length && lines[nextLine]!.trim() === "") {
        nextLine++;
      }

      const exportLine = nextLine + 1; // convert to 1-indexed
      const exportName = exportLines.get(exportLine);

      if (exportName) {
        const codes = extractExampleCode(jsdocLines.join("\n"));
        for (const code of codes) {
          examples.push({ name: exportName, code });
        }
      }
    } else {
      i++;
    }
  }

  return examples;
}

/** Parses `@example` sections from a raw JSDoc comment string and returns the code-fence content. */
function extractExampleCode(jsdoc: string): string[] {
  const codes: string[] = [];
  const lines = jsdoc.split("\n");
  let inCodeBlock = false;
  let inExample = false;
  let currentCode: string[] = [];

  for (const rawLine of lines) {
    // Strip JSDoc line prefix before checking for @example / fences
    const docContent = rawLine.replace(/^\s*\*\s?/, "");

    if (docContent.startsWith("@example")) {
      inExample = true;
      continue;
    }

    if (!inExample) continue;

    if (docContent.startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        if (currentCode.length > 0) {
          codes.push(currentCode.join("\n"));
          currentCode = [];
        }
        inCodeBlock = false;
        inExample = false;
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      // Strip JSDoc line prefix: " * " or " *" or just leading whitespace
      const stripped = rawLine.replace(/^\s*\*\s?/, "");
      currentCode.push(stripped);
    }
  }

  // Close unclosed code block
  if (inCodeBlock && currentCode.length > 0) {
    codes.push(currentCode.join("\n"));
  }

  return codes;
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
  const sourceClean = stripExampleBlocks(source);
  const imports = extractImports(source);
  const description = extractDescription(source, modulePath);
  const exports = extractExports(source);
  const exportsClean = extractExports(sourceClean);
  const examples = extractExamples(source, exports);
  const children = isDir ? scanChildren(modulePath) : undefined;
  return {
    name: modulePath,
    source,
    sourceClean,
    imports,
    description,
    exports,
    exportsClean,
    importPath: `typescript-bits/${modulePath}`,
    examples,
    children,
  };
}

export function getAllModules(): ModuleMeta[] {
  const modules = getModuleNames().map(getModuleContent);
  modules.sort((a, b) => a.name.localeCompare(b.name));
  return modules;
}

const KNOWN_IMPORTS: Record<string, string> = {
  atom: 'import { atom, type Atom } from "typescript-bits/atom";',
  result: 'import { Result } from "typescript-bits/result";',
  queue: 'import { Queue } from "typescript-bits/queue";',
  safe: 'import { Safe } from "typescript-bits/safe";',
  retry: 'import { retry } from "typescript-bits/retry";',
  json: 'import { RichJSON } from "typescript-bits/json";',
  types: 'import type { Enumerate, Range } from "typescript-bits/types";',
  reset: 'import "typescript-bits/reset";',
  "reset/array": 'import "typescript-bits/reset/array";',
  "reset/json": 'import "typescript-bits/reset/json";',
  "reset/map": 'import "typescript-bits/reset/map";',
  "reset/set": 'import "typescript-bits/reset/set";',
  "reset/fetch": 'import "typescript-bits/reset/fetch";',
  "reset/filter": 'import "typescript-bits/reset/filter";',
};

/**
 * Returns a sensible import statement for a module, used in docs usage view.
 */
export function getImportCode(modulePath: string): string {
  return KNOWN_IMPORTS[modulePath] ?? `import { ... } from "typescript-bits/${modulePath}";`;
}

/**
 * Returns a local import statement for a module when installing via CLI source copy.
 * Derives from the known package import by swapping the path.
 */
export function getLocalImportCode(modulePath: string): string {
  const pkgImport = KNOWN_IMPORTS[modulePath];
  if (!pkgImport) {
    return `import { ... } from "../lib/bits/${modulePath}";`;
  }
  // Replace "typescript-bits/..." with "../lib/bits/..."
  return pkgImport.replace(/"typescript-bits(\/[^"]*)?"/, `"../lib/bits/${modulePath}"`);
}
