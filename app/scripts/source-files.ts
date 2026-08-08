import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { createHighlighter, type Highlighter } from "shiki";

// process.cwd() = app/ during `next build`
// Turbopack ignore scopes the fs tracing to prevent NFT warnings
const PACKAGES_DIR = join(/*turbopackIgnore: true*/ process.cwd(), "..", "packages");

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
  displayName: string;
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

const MODULE_DISPLAY_NAMES: Record<string, string> = {
  atom: "Atom",
  json: "Rich JSON",
  queue: "Queue",
  reset: "Reset",
  result: "Result",
  retry: "Retry",
  safe: "Safe",
  types: "Types",
};

function getModuleDisplayName(name: string): string {
  return MODULE_DISPLAY_NAMES[name] ?? name.charAt(0).toUpperCase() + name.slice(1);
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
  // Match only at line start (m flag) to avoid JSDoc examples;
  // captures relative paths (./, ../) and internal @typescript-bits/ imports
  const regex = /^\s*(?:import|export)\s+.*?from\s+["']((?:\.\.?\/[^"']*|@typescript-bits\/[^"']*))["']/gm;
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
  // Find the first JSDoc block
  const jsdocMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
  if (!jsdocMatch?.[1]) return descriptionFallback[name] ?? name;

  // Strip the leading " * " prefix from each JSDoc line, drop the opening/closing delimiters
  const rawLines = jsdocMatch[1].split("\n");
  // Each line looks like: "   * content" or "   *"
  const docLines = rawLines.map((l) => l.replace(/^\s*\*\s?/, ""));

  // Stopping rule: empty line (blank or whitespace only) or a new tag
  const isStop = (line: string) => line.trim() === "" || line.startsWith("@");

  // Check for @summary tag
  const summaryIdx = docLines.findIndex((l) => l.startsWith("@summary"));
  if (summaryIdx !== -1) {
    // First line: strip the "@summary " prefix, then collect continuation lines
    const firstContent = docLines[summaryIdx]!.replace(/^@summary\s*/, "").trim();
    const parts: string[] = firstContent ? [firstContent] : [];
    for (let i = summaryIdx + 1; i < docLines.length; i++) {
      const line = docLines[i]!;
      if (isStop(line)) break;
      parts.push(line.trim());
    }
    const result = parts.join(" ").trim();
    if (result) return result;
  }

  // No @summary — use the first paragraph (content before first empty line or tag)
  // Skip leading blank lines (the newline right after /**), then stop at the first blank or tag
  const parts: string[] = [];
  let started = false;
  for (const line of docLines) {
    const trimmed = line.trim();
    if (!started) {
      if (trimmed === "") continue; // skip leading blanks
      started = true;
    }
    if (isStop(line)) break;
    if (trimmed) parts.push(trimmed);
  }
  const result = parts.join(" ").trim();
  if (result) return result;

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
 * Removes duplicate import statements from code. Keeps the first occurrence
 * of each unique import line, discarding subsequent duplicates along with
 * the blank line that follows them.
 */
function deduplicateImports(code: string): string {
  const seen = new Set<string>();
  const lines = code.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i]!.trim();
    if (/^import\s/.test(trimmed)) {
      if (seen.has(trimmed)) {
        // Skip the blank line that follows the duplicate import
        if (i + 1 < lines.length && lines[i + 1]!.trim() === "") i++;
        continue;
      }
      seen.add(trimmed);
    }
    result.push(lines[i]!);
  }

  return result.join("\n");
}

/**
 * Replaces `typescript-bits` import paths with `../lib/bits/` local paths
 * in import statements. Used to generate copy-source-friendly examples.
 */
export function transformImportsToLocal(code: string): string {
  return code.replace(/"typescript-bits\//g, '"../lib/bits/');
}

/**
 * Concatenates usage examples into a single code string, with `// ExportName`
 * comments separating each example block. Duplicate import lines are stripped.
 */
export function concatExampleCode(examples: ModuleExample[]): string {
  const code = examples.map((ex) => `// ${ex.name}\n${ex.code}`).join("\n\n");
  return deduplicateImports(code);
}

/**
 * Scans the source for JSDoc `/** @example ... *&#47;` blocks and extracts the
 * code-fenced content that immediately precedes each export declaration.
 * Returns one entry per `@example` code block, keyed by export name.
 */
function extractExamples(source: string, exports: ModuleExport[], fallbackName?: string): ModuleExample[] {
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
      const exampleName = exportLines.get(exportLine) ?? fallbackName;

      if (exampleName) {
        const codes = extractExampleCode(jsdocLines.join("\n"));
        for (const code of codes) {
          examples.push({ name: exampleName, code });
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

const HIGHlIGHTER_KEY = "__shiki_highlighter__";

function getHighlighter(): Promise<Highlighter> {
  const g = globalThis as unknown as Record<string, Promise<Highlighter> | undefined>;
  if (!g[HIGHlIGHTER_KEY]) {
    g[HIGHlIGHTER_KEY] = createHighlighter({ themes: ["github-dark"], langs: ["ts", "bash"] });
  }
  return g[HIGHlIGHTER_KEY]!;
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
  const entries = readdirSync(PACKAGES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const srcIndex = join(PACKAGES_DIR, entry.name, "src", "index.ts");
      try {
        if (readFileSync(srcIndex, "utf-8")) names.push(entry.name);
      } catch {
        // no src/index.ts — not a module
      }
    }
  }
  return names;
}

function scanChildren(modulePath: string): ModuleChild[] {
  const dirPath = join(PACKAGES_DIR, modulePath, "src");
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
  const filePath = join(PACKAGES_DIR, modulePath, "src", "index.ts");
  const source = readFileSync(filePath, "utf-8");
  const sourceClean = stripExampleBlocks(source);
  const imports = extractImports(source);
  const description = extractDescription(source, modulePath);
  const exports = extractExports(source);
  const exportsClean = extractExports(sourceClean);
  const examples = extractExamples(source, exports);
  const children = scanChildren(modulePath);
  return {
    name: modulePath,
    displayName: getModuleDisplayName(modulePath),
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

export function getSubmoduleContent(moduleName: string, submoduleName: string): ModuleMeta {
  const filePath = join(PACKAGES_DIR, moduleName, "src", `${submoduleName}.ts`);
  const source = readFileSync(filePath, "utf-8");
  const sourceClean = stripExampleBlocks(source);
  const imports = extractImports(source);
  const description = extractDescription(source, submoduleName);
  const exports = extractExports(source);
  const exportsClean = extractExports(sourceClean);
  const examples = extractExamples(source, exports, submoduleName);
  return {
    name: `${moduleName}/${submoduleName}`,
    displayName: submoduleName,
    source,
    sourceClean,
    imports,
    description,
    exports,
    exportsClean,
    importPath: `typescript-bits/${moduleName}/${submoduleName}`,
    examples,
    children: [],
  };
}

export function getAllModules(): ModuleMeta[] {
  const modules = getModuleNames().map(getModuleContent);
  modules.sort((a, b) => a.name.localeCompare(b.name));
  return modules;
}

// ── Skill discovery ──────────────────────────────────────────────────────────

const SKILLS_DIR = join(/*turbopackIgnore: true*/ process.cwd(), "..", "skills");

export interface SkillMeta {
  name: string;
  displayName: string;
  description: string;
  content: string;
  lineCount: number;
  tokenCount: number;
}

function yamlField(body: string, key: string): string | undefined {
  const regex = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const match = regex.exec(body);
  return match?.[1]?.trim();
}

/**
 * Parses a SKILL.md file (with YAML frontmatter) into SkillMeta.
 * Frontmatter must be delimited by `---` on its own line at start and end.
 */
export function parseSkillFile(filePath: string): SkillMeta {
  const content = readFileSync(filePath, "utf-8");

  // Must start with `---`
  if (!content.startsWith("---")) {
    throw new Error(`Skill file ${filePath} is missing YAML frontmatter`);
  }

  // Match closing `---` after the first line
  const afterFirst = content.slice(3); // skip opening `---`
  const endMatch = afterFirst.match(/^---[\r\n]/m);
  if (!endMatch || endMatch.index === undefined) {
    throw new Error(`Skill file ${filePath} has unclosed YAML frontmatter`);
  }

  const fmRaw = afterFirst.slice(0, endMatch.index);
  const body = afterFirst.slice(endMatch.index + endMatch[0].length);

  const name = yamlField(fmRaw, "name") ?? "";
  const description = yamlField(fmRaw, "description") ?? "";

  return {
    name,
    displayName: name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description,
    content: body.trim(),
    lineCount: content.split("\n").length,
    tokenCount: Math.round(body.trim().length / 4),
  };
}

export function getSkillNames(): string[] {
  const names: string[] = [];
  try {
    const entries = readdirSync(SKILLS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillFile = join(SKILLS_DIR, entry.name, "SKILL.md");
        try {
          if (readFileSync(skillFile, "utf-8")) names.push(entry.name);
        } catch {
          // no SKILL.md — not a skill
        }
      }
    }
  } catch {
    // skills/ directory doesn't exist
  }
  return names.sort();
}

export function getSkillContent(skillName: string): SkillMeta {
  const filePath = join(SKILLS_DIR, skillName, "SKILL.md");
  return parseSkillFile(filePath);
}

export function getAllSkills(): SkillMeta[] {
  return getSkillNames().map(getSkillContent);
}

// ── Recipe discovery ─────────────────────────────────────────────────────────

const RECIPES_DIR = join(/*turbopackIgnore: true*/ process.cwd(), "..", "recipes");

export interface RecipeMeta {
  name: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
  lineCount: number;
  tokenCount: number;
}

/**
 * Parses a YAML array field from a frontmatter block.
 * Handles both inline flow (`tags: [a, b, c]`) and block (`- a`) forms.
 * Returns `[]` when the field is absent.
 */
export function yamlList(body: string, key: string): string[] {
  // Inline flow: tags: [react, zod, typescript]
  const inlineRegex = new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, "m");
  const inlineMatch = inlineRegex.exec(body);
  if (inlineMatch?.[1]) {
    return inlineMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter((s) => s.length > 0);
  }

  // Block form: find the key, then collect `- value` lines that immediately follow
  const keyRegex = new RegExp(`^${key}:\\s*$`, "m");
  const keyMatch = keyRegex.exec(body);
  if (keyMatch !== null) {
    const afterKey = body.slice(keyMatch.index + keyMatch[0].length);
    const items: string[] = [];
    for (const line of afterKey.split("\n")) {
      const itemMatch = /^\s*-\s+(.+)$/.exec(line);
      if (itemMatch?.[1]) {
        items.push(itemMatch[1].trim().replace(/^["']|["']$/g, ""));
      } else if (line.trim() !== "") {
        // Non-empty, non-list line ends the block
        break;
      }
    }
    return items;
  }

  return [];
}

/**
 * Parses a flat recipe `.md` file (with YAML frontmatter) into RecipeMeta.
 * Frontmatter must be delimited by `---` on its own line at start and end.
 */
export function parseRecipeFile(filePath: string): RecipeMeta {
  const content = readFileSync(filePath, "utf-8");

  if (!content.startsWith("---")) {
    throw new Error(`Recipe file ${filePath} is missing YAML frontmatter`);
  }

  const afterFirst = content.slice(3);
  const endMatch = afterFirst.match(/^---[\r\n]/m);
  if (!endMatch || endMatch.index === undefined) {
    throw new Error(`Recipe file ${filePath} has unclosed YAML frontmatter`);
  }

  const fmRaw = afterFirst.slice(0, endMatch.index);
  const body = afterFirst.slice(endMatch.index + endMatch[0].length);

  const name = yamlField(fmRaw, "name") ?? "";
  const title = yamlField(fmRaw, "title") ?? "";
  const description = yamlField(fmRaw, "description") ?? "";
  const tags = yamlList(fmRaw, "tags");

  return {
    name,
    title: title || name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description,
    tags,
    content: body.trim(),
    lineCount: content.split("\n").length,
    tokenCount: Math.round(body.trim().length / 4),
  };
}

export function getRecipeNames(): string[] {
  const names: string[] = [];
  try {
    const entries = readdirSync(RECIPES_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        names.push(entry.name.replace(/\.md$/, ""));
      }
    }
  } catch {
    // recipes/ directory doesn't exist
  }
  return names.sort();
}

export function getRecipeContent(recipeName: string): RecipeMeta {
  const filePath = join(RECIPES_DIR, `${recipeName}.md`);
  return parseRecipeFile(filePath);
}

export function getAllRecipes(): RecipeMeta[] {
  return getRecipeNames().map(getRecipeContent);
}

// ── Blog discovery ───────────────────────────────────────────────────────────

const BLOGS_DIR = join(/*turbopackIgnore: true*/ process.cwd(), "..", "blogs");

export interface BlogMeta {
  name: string;
  title: string;
  /** ISO date string */
  date: string;
  tags: string[];
  description: string;
  /** Explicit related-post slugs, in priority order; overrides tag-based ranking when present */
  related?: string[];
  content: string;
  lineCount: number;
  tokenCount: number;
}

/**
 * Parses a blog post `<slug>/index.md` file (with YAML frontmatter) into BlogMeta.
 * Frontmatter must be delimited by `---` on its own line at start and end.
 * The directory name is the canonical slug; a mismatched `name` field is ignored (with a warning).
 */
export function parseBlogFile(filePath: string, dirName: string): BlogMeta {
  const content = readFileSync(filePath, "utf-8");

  if (!content.startsWith("---")) {
    throw new Error(`Blog file ${filePath} is missing YAML frontmatter`);
  }

  const afterFirst = content.slice(3);
  const endMatch = afterFirst.match(/^---[\r\n]/m);
  if (!endMatch || endMatch.index === undefined) {
    throw new Error(`Blog file ${filePath} has unclosed YAML frontmatter`);
  }

  const fmRaw = afterFirst.slice(0, endMatch.index);
  const body = afterFirst.slice(endMatch.index + endMatch[0].length);

  const frontmatterName = yamlField(fmRaw, "name");
  if (frontmatterName && frontmatterName !== dirName) {
    console.warn(
      `Blog frontmatter name "${frontmatterName}" in ${filePath} does not match directory "${dirName}"; using directory name`,
    );
  }

  const title = yamlField(fmRaw, "title") ?? "";
  const date = yamlField(fmRaw, "date") ?? "";
  const description = yamlField(fmRaw, "description") ?? "";
  const tags = yamlList(fmRaw, "tags");
  const related = yamlList(fmRaw, "related");

  return {
    name: dirName,
    title: title || dirName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    date,
    tags,
    description,
    related: related.length > 0 ? related : undefined,
    content: body.trim(),
    lineCount: content.split("\n").length,
    tokenCount: Math.round(body.trim().length / 4),
  };
}

export function getBlogNames(): string[] {
  const names: string[] = [];
  try {
    const entries = readdirSync(BLOGS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const indexFile = join(BLOGS_DIR, entry.name, "index.md");
        try {
          if (readFileSync(indexFile, "utf-8")) names.push(entry.name);
        } catch {
          // no index.md — not a blog post
        }
      }
    }
  } catch {
    // blogs/ directory doesn't exist
  }
  return names.sort();
}

export function getBlogContent(slug: string): BlogMeta {
  const filePath = join(BLOGS_DIR, slug, "index.md");
  return parseBlogFile(filePath, slug);
}

/** Returns all blog posts sorted newest-first by `date` (stable tie-break by slug). */
export function getAllBlogs(): BlogMeta[] {
  const blogs = getBlogNames().map(getBlogContent);
  blogs.sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.name.localeCompare(b.name);
  });
  return blogs;
}

/**
 * Returns related posts for a given slug, capped at `limit`.
 * If the post declares `related[]`, resolves those slugs (existing posts only, order preserved).
 * Otherwise ranks other posts by shared-tag count descending, tie-breaking by date descending.
 */
export function getRelatedBlogs(slug: string, limit = 3): BlogMeta[] {
  const allBlogs = getAllBlogs();
  const post = allBlogs.find((b) => b.name === slug);
  if (!post) return [];

  const others = allBlogs.filter((b) => b.name !== slug);

  if (post.related && post.related.length > 0) {
    const byName = new Map(others.map((b) => [b.name, b]));
    const resolved: BlogMeta[] = [];
    for (const relatedSlug of post.related) {
      const match = byName.get(relatedSlug);
      if (match) resolved.push(match);
      if (resolved.length >= limit) break;
    }
    return resolved;
  }

  const postTags = new Set(post.tags);
  return others
    .map((blog) => ({ blog, shared: blog.tags.filter((tag) => postTags.has(tag)).length }))
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      return new Date(b.blog.date).getTime() - new Date(a.blog.date).getTime();
    })
    .slice(0, limit)
    .map((entry) => entry.blog);
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

// ── Release notes ─────────────────────────────────────────────────────────────

const ROOT_DIR = join(/*turbopackIgnore: true*/ process.cwd(), "..");
const CHANGELOG_PATH = join(ROOT_DIR, "CHANGELOG.md");

export type BumpType = "major" | "minor" | "patch";

export interface ReleaseEntry {
  hash: string | null;
  description: string;
}

export interface ReleaseGroup {
  type: BumpType;
  label: string;
  entries: ReleaseEntry[];
}

export interface ReleaseMeta {
  version: string;
  date: string | null;
  bump: BumpType;
  groups: ReleaseGroup[];
}

const BUMP_RANK: Record<BumpType, number> = { patch: 0, minor: 1, major: 2 };

function parseGroupType(label: string): BumpType | null {
  const lower = label.toLowerCase();
  if (lower.startsWith("major")) return "major";
  if (lower.startsWith("minor")) return "minor";
  if (lower.startsWith("patch")) return "patch";
  return null;
}

function parseEntry(text: string): ReleaseEntry {
  const match = /^([0-9a-f]{7}):\s*(.*)$/.exec(text);
  if (!match) return { hash: null, description: text };
  return { hash: match[1]!, description: match[2]! };
}

function highestBump(groups: ReleaseGroup[]): BumpType {
  let bump: BumpType = "patch";
  for (const group of groups) {
    if (BUMP_RANK[group.type] > BUMP_RANK[bump]) bump = group.type;
  }
  return bump;
}

/** Parses a changesets-generated `CHANGELOG.md` string into `ReleaseMeta[]` (file order, newest first). */
export function parseChangelog(content: string): ReleaseMeta[] {
  const releases: ReleaseMeta[] = [];
  let currentGroup: ReleaseGroup | null = null;

  for (const line of content.split("\n")) {
    const releaseMatch = /^##(?!#)\s+(\S+)(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?\s*$/.exec(line);
    if (releaseMatch) {
      releases.push({ version: releaseMatch[1]!, date: releaseMatch[2] ?? null, bump: "patch", groups: [] });
      currentGroup = null;
      continue;
    }

    const groupMatch = /^###(?!#)\s+(.+)$/.exec(line);
    const currentRelease = releases[releases.length - 1];
    if (groupMatch && currentRelease) {
      const label = groupMatch[1]!.trim();
      // Unrecognized headings still get rendered; "patch" is the lowest-severity
      // default so a fallback group can never inflate a release's computed bump.
      const type = parseGroupType(label) ?? "patch";
      currentGroup = { type, label, entries: [] };
      currentRelease.groups.push(currentGroup);
      continue;
    }

    const entryMatch = /^\s*-\s+(.+)$/.exec(line);
    if (entryMatch && currentGroup) {
      currentGroup.entries.push(parseEntry(entryMatch[1]!.trim()));
      continue;
    }

    if (currentGroup && line.trim() !== "" && currentGroup.entries.length > 0) {
      const last = currentGroup.entries[currentGroup.entries.length - 1]!;
      last.description += ` ${line.trim()}`;
    }
  }

  for (const release of releases) {
    release.bump = highestBump(release.groups);
  }

  return releases;
}

/** Returns all releases parsed from the root `CHANGELOG.md`, in file order (newest first). */
export function getAllReleases(): ReleaseMeta[] {
  try {
    const content = readFileSync(CHANGELOG_PATH, "utf-8");
    return parseChangelog(content);
  } catch {
    return [];
  }
}
