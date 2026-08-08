import { highlightCode } from "../../scripts/source-files";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const highlightCache = new Map<string, string>();

async function awaitHighlightInner(code: string, lang: string): Promise<{ html: string; normalizedLang: string }> {
  const key = `${lang}:${code.slice(0, 80)}`;
  const cached = highlightCache.get(key);
  if (cached) return { html: cached, normalizedLang: lang };

  // Only ts and bash are supported by our highlighter
  const normalizedLang = lang === "typescript" || lang === "json" || lang === "ts" ? "ts" : "bash";
  try {
    const highlighted = await highlightCode(code, normalizedLang as "ts" | "bash");
    highlightCache.set(key, highlighted);
    return { html: highlighted, normalizedLang };
  } catch {
    // Fallback to plain pre if highlighting fails
    return {
      html: `<pre class="rounded-lg border bg-zinc-900 p-4 overflow-x-auto text-sm">${escapeHtml(code)}</pre>`,
      normalizedLang: lang,
    };
  }
}

/**
 * Applies all inline formatting transformations in order:
 * backtick code, __underline__ mono-italic, and **bold**.
 */
function inlineFormat(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-sm font-mono">`$1`</code>')
    .replace(/__([^_]+)__/g, '<code class="rounded bg-muted px-1 py-0.5 text-sm font-mono italic">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/**
 * Structured content chunk from rendering markdown.
 */
export interface HtmlChunk {
  type: "html";
  html: string;
  /** Markdown heading level (1=`#`, 2=`##`, 3=`###`). Only set on heading chunks. */
  headingLevel?: number;
  /** Deterministic slug id for heading chunks. Only set on heading chunks. */
  id?: string;
  /** Plain (unformatted) heading text. Only set on heading chunks. */
  headingText?: string;
}

export interface CodeChunk {
  type: "code";
  html: string;
  code: string;
  lang: string;
}

export type ContentChunk = HtmlChunk | CodeChunk;

/**
 * A chapter groups the content chunks for one `##` section (or the pre-`##` intro).
 */
export interface Chapter {
  id: string;
  title: string;
  chunks: ContentChunk[];
}

/**
 * Groups flat ContentChunk[] into Chapter[]. Splits on markdown `##` headings (headingLevel === 2).
 * Any chunks before the first `##` become an "Overview" chapter (omitted if there are none).
 * The heading chunk itself is included in its chapter as the first chunk.
 */
export function groupIntoChapters(chunks: ContentChunk[]): Chapter[] {
  const chapters: Chapter[] = [];
  let current: Chapter | null = null;

  for (const chunk of chunks) {
    if (chunk.type === "html" && chunk.headingLevel === 2) {
      // Flush the previous chapter
      if (current !== null) {
        chapters.push(current);
      }
      current = {
        id: chunk.id ?? "section",
        title: chunk.headingText ?? "Section",
        chunks: [chunk],
      };
    } else if (current === null) {
      // Pre-first-## content — buffer into a deferred overview
      if (chapters.length === 0) {
        // lazily create the overview chapter
        chapters.push({ id: "overview", title: "Overview", chunks: [] });
      }
      chapters[0]!.chunks.push(chunk);
    } else {
      current.chunks.push(chunk);
    }
  }

  // Flush last chapter
  if (current !== null) {
    chapters.push(current);
  }

  // Drop the overview chapter if it ended up empty
  if (chapters.length > 0 && chapters[0]!.id === "overview" && chapters[0]!.chunks.length === 0) {
    chapters.shift();
  }

  return chapters;
}

/**
 * Produces a deterministic, URL-safe slug from a heading's plain text.
 * Collisions within a single render are resolved by appending `-N` (N >= 1).
 */
function toSlug(text: string, seen: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

/**
 * Processes markdown content into structured chunks:
 * - Fenced code blocks are highlighted with Shiki and returned as CodeChunk
 * - Tables, headings, blockquotes, lists, and paragraphs are rendered as HtmlChunk
 */
export async function renderMarkdown(content: string): Promise<ContentChunk[]> {
  const lines = content.split("\n");
  const chunks: ContentChunk[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  const codeLines: string[] = [];
  const tableLines: string[] = [];
  const seenSlugs = new Map<string, number>();

  function flushTable() {
    if (tableLines.length > 0) {
      const parseRow = (line: string) =>
        line
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c !== "");

      const [headerLine, ...bodyLines] = tableLines;
      const headerCells = parseRow(headerLine!);
      const bodyRows = bodyLines.map((row) => {
        const cells = parseRow(row);
        return `<tr>${cells
          .map(
            (c) =>
              `<td class="px-4 py-2.5 text-sm text-muted-foreground border-t border-border">${inlineFormat(c)}</td>`,
          )
          .join("")}</tr>`;
      });

      chunks.push({
        type: "html",
        html: `<div class="overflow-x-auto my-4 rounded-lg border">
<table class="w-full text-sm">
<thead><tr>${headerCells
          .map(
            (c) =>
              `<th class="px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider text-left bg-muted/30 border-b border-border">${inlineFormat(c)}</th>`,
          )
          .join("")}</tr></thead>
<tbody>${bodyRows.join("")}</tbody>
</table>
</div>`,
      });
      tableLines.length = 0;
    }
  }

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      if (inCodeBlock) {
        const code = codeLines.join("\n");
        const result = await awaitHighlightInner(code, codeLang || "ts");
        chunks.push({ type: "code", html: result.html, code, lang: result.normalizedLang });
        codeLines.length = 0;
        codeLang = "";
        inCodeBlock = false;
      } else {
        flushTable();
        inCodeBlock = true;
        const trimmed = line.trimStart();
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === "") {
      flushTable();
      chunks.push({ type: "html", html: '<div class="h-3"></div>' });
      continue;
    }

    // Table row
    if (line.trimStart().startsWith("|")) {
      // Skip separator rows (| --- | --- |)
      if (!/^\|[\s-:]+\|/.test(line.trim())) {
        tableLines.push(line);
      }
      continue;
    }

    flushTable();

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]!.length;
      const rawText = headingMatch[2]!;
      const text = inlineFormat(rawText);
      const tag = `h${level + 1}`; // h2/h3/h4 since h1 is the page title
      const sizes: Record<number, string> = {
        1: "text-2xl font-bold mt-8",
        2: "text-xl font-semibold mt-6",
        3: "text-base font-semibold mt-4",
      };
      const slug = toSlug(rawText, seenSlugs);
      chunks.push({
        type: "html",
        html: `<${tag} id="${slug}" class="${sizes[level]}">${text}</${tag}>`,
        headingLevel: level,
        id: slug,
        headingText: rawText,
      });
      continue;
    }

    // Blockquote
    const blockquoteMatch = line.match(/^>\s+(.+)$/);
    if (blockquoteMatch) {
      chunks.push({
        type: "html",
        html: `<blockquote class="border-l-2 border-border pl-4 text-sm text-muted-foreground italic my-1">${inlineFormat(blockquoteMatch[1]!)}</blockquote>`,
      });
      continue;
    }

    // Unordered list
    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      chunks.push({
        type: "html",
        html: `<li class="text-sm text-foreground ml-4 list-disc">${inlineFormat(listMatch[1]!)}</li>`,
      });
      continue;
    }

    // Regular paragraph
    chunks.push({ type: "html", html: `<p class="text-sm text-foreground">${inlineFormat(line)}</p>` });
  }

  flushTable();

  // If code block wasn't closed
  if (inCodeBlock && codeLines.length > 0) {
    const code = codeLines.join("\n");
    const result = await awaitHighlightInner(code, codeLang || "ts");
    chunks.push({ type: "code", html: result.html, code, lang: result.normalizedLang });
  }

  return chunks;
}
