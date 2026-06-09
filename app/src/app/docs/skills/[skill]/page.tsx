import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { getSkillNames, getSkillContent, highlightCode } from "../../../../../scripts/source-files";
import { CodeBlock } from "#/code-block";
import { ScrollProgress } from "#/scroll-progress";
import { CodeCopyButton } from "#/copy-button";

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
  const { skill: skillName } = await params;
  let skill;
  try {
    skill = getSkillContent(skillName);
  } catch {
    notFound();
  }
  return {
    title: `${skill.displayName} — typescript-bits skills`,
    description: skill.description,
    openGraph: { title: skill.displayName, description: skill.description },
    twitter: { title: skill.displayName, description: skill.description },
  };
}

export function generateStaticParams() {
  return getSkillNames().map((name) => ({ skill: name }));
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

let highlightCache = new Map<string, string>();

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
 * Structured content chunk from rendering skill markdown.
 */
interface HtmlChunk {
  type: "html";
  html: string;
}

interface CodeChunk {
  type: "code";
  html: string;
  code: string;
  lang: string;
}

type ContentChunk = HtmlChunk | CodeChunk;

/**
 * Processes the skill markdown content into structured chunks:
 * - Fenced code blocks are highlighted with Shiki and returned as CodeChunk
 * - Tables, headings, and paragraphs are rendered as HtmlChunk
 */
async function renderSkillContent(content: string): Promise<ContentChunk[]> {
  const lines = content.split("\n");
  const chunks: ContentChunk[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  const codeLines: string[] = [];
  const tableLines: string[] = [];

  function flushTable() {
    if (tableLines.length > 0) {
      const parseRow = (line: string) =>
        line
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c !== "");

      // First row is the header (separator rows are already skipped during collection)
      const [headerLine, ...bodyLines] = tableLines;
      const headerCells = parseRow(headerLine!);
      const bodyRows = bodyLines.map((row) => {
        const cells = parseRow(row);
        return `<tr>${cells
          .map((c) => `<td class="px-4 py-2.5 text-sm text-muted-foreground border-t border-border">${c}</td>`)
          .join("")}</tr>`;
      });

      chunks.push({
        type: "html",
        html: `<div class="overflow-x-auto my-4 rounded-lg border">
<table class="w-full text-sm">
<thead><tr>${headerCells
          .map(
            (c) =>
              `<th class="px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider text-left bg-muted/30 border-b border-border">${c}</th>`,
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
        // Close code block
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
      const text = headingMatch[2]!;
      const tag = `h${level + 1}`; // h2/h3/h4 since h1 is the page title
      const sizes: Record<number, string> = {
        1: "text-2xl font-bold mt-8",
        2: "text-xl font-semibold mt-6",
        3: "text-base font-semibold mt-4",
      };
      chunks.push({ type: "html", html: `<${tag} class="${sizes[level]}">${text}</${tag}>` });
      continue;
    }

    // Inline code
    const processed = line.replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-muted px-1 py-0.5 text-sm font-mono">$1</code>',
    );

    // Bold
    const boldProcessed = processed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Unordered list
    const listMatch = boldProcessed.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      chunks.push({
        type: "html",
        html: `<li class="text-sm text-muted-foreground ml-4 list-disc">${listMatch[1]}</li>`,
      });
      continue;
    }

    // Regular paragraph
    chunks.push({ type: "html", html: `<p class="text-sm text-muted-foreground">${boldProcessed}</p>` });
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

export default async function SkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill: skillName } = await params;
  let skill;
  try {
    skill = getSkillContent(skillName);
  } catch {
    notFound();
  }

  const contentChunks = await renderSkillContent(skill.content);

  return (
    <>
      <ScrollProgress />
      <div className="flex flex-col container-main py-8 gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/skills">Skills</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{skill.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{skill.displayName}</h1>
          <p className="text-muted-foreground">{skill.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            OpenCode
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Codex
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Claude Code
          </Badge>
        </div>

        {/* Installation */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Install via the skills CLI (<code className="text-xs font-mono">skills.sh</code>):
            </p>
            <span className="text-xs font-medium text-muted-foreground">npx</span>
          </div>
          <div className="flex items-center gap-3 bg-background rounded-md border px-4 py-3">
            <code className="flex-1 text-sm font-mono select-all" style={{ fontVariantLigatures: "none" }}>
              npx skills add m10rten/typescript-bits --skill {skill.name}
            </code>
            <CodeCopyButton source={`npx skills add m10rten/typescript-bits --skill ${skill.name}`} label="copy" />
          </div>
          <p className="text-xs text-muted-foreground">
            Skills are auto-discovered from this repository; the <code className="text-xs font-mono">--skill</code>{" "}
            flag installs only this skill.
          </p>
        </div>

        {/* Skill content */}
        <div className="flex flex-col gap-0">
          <div className="w-[85%] mx-auto border-t border-border" />
          <div className="flex items-center justify-between gap-2 pt-4 ">
            <span className="text-xs text-muted-foreground">
              <code className="font-mono">skill.md</code> &middot; {skill.lineCount} lines &middot; {skill.tokenCount}{" "}
              tokens
            </span>
            <CodeCopyButton
              source={skill.content}
              label="Copy Content"
              className="h-7 gap-1 px-2 rounded-md border border-border bg-background text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 shrink-0"
            />
          </div>
          <div className="max-w-none">
            {contentChunks.map((chunk, i) => {
              if (chunk.type === "code") {
                return (
                  <div key={i} className="my-4">
                    <CodeBlock html={chunk.html} code={chunk.code} lang={chunk.lang} />
                  </div>
                );
              }
              return <div key={i} dangerouslySetInnerHTML={{ __html: chunk.html }} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
