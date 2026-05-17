import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to the package source — the single source of truth
const PACKAGE_SRC = resolve(__dirname, "../packages/my-utils/src");
const OUTPUT_DIR = resolve(__dirname, "public");

interface SourceFile {
  name: string;
  content: string;
  isEntry: boolean;
  imports: string[];
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  const regex = /(?:import|export)\s+.*?from\s+["'](\.[^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    imports.push(basename(match[1]).replace(/\.js$/, ".ts"));
  }
  return imports;
}

function readSourceFiles(dir: string): SourceFile[] {
  const files: SourceFile[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".ts")) {
      const content = readFileSync(join(dir, entry.name), "utf-8");
      files.push({
        name: entry.name,
        content,
        isEntry: entry.name === "index.ts",
        imports: extractImports(content),
      });
    }
  }

  files.sort((a, b) => {
    if (a.isEntry) return -1;
    if (b.isEntry) return 1;
    return a.name.localeCompare(b.name);
  });

  return files;
}

function resolveAllDeps(fileName: string, files: SourceFile[], visited = new Set<string>()): string[] {
  if (visited.has(fileName)) return [];
  visited.add(fileName);

  const file = files.find((f) => f.name === fileName);
  if (!file) return [];

  const deps: string[] = [];
  for (const imp of file.imports) {
    deps.push(imp);
    deps.push(...resolveAllDeps(imp, files, visited));
  }
  return deps;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateHtml(files: SourceFile[]): string {
  const nonEntry = files.filter((f) => !f.isEntry);
  const modNames = nonEntry.map((f) => f.name.replace(".ts", ""));

  const codeBlocks = files
    .map((f) => {
      const deps = f.imports.length ? `<span class="deps">deps: ${f.imports.map(escapeHtml).join(", ")}</span>` : "";
      const installCmd = f.isEntry
        ? ""
        : `<span class="install-hint">pnpm install-utils ${f.name.replace(".ts", "")}</span>`;

      return `
    <section class="file-section">
      <div class="file-header">
        <span class="file-name">${escapeHtml(f.name)}</span>
        ${f.isEntry ? '<span class="badge">entry</span>' : ""}
        ${deps}
        <div class="header-actions">
          ${installCmd}
          <button class="copy-btn" data-target="code-${f.name}" onclick="copyCode(this)">
            Copy
          </button>
        </div>
      </div>
      <div class="code-wrapper">
        <pre><code id="code-${f.name}">${escapeHtml(f.content)}</code></pre>
      </div>
    </section>`;
    })
    .join("\n");

  const copyPasteImports = nonEntry
    .map((f) => {
      const modName = f.name.replace(".ts", "");
      return `import { ... } from "@poc/my-utils/${modName}";`;
    })
    .join("\n");

  const cliExample = `pnpm install-utils format-utils`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@poc/my-utils — Install or Copy-Paste</title>
  <style>
    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: #30363d;
      --text: #c9d1d9;
      --text-muted: #8b949e;
      --accent: #58a6ff;
      --green: #3fb950;
      --orange: #d29922;
      --code-bg: #0d1117;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
    }

    .container { max-width: 800px; margin: 0 auto; }

    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.3rem; margin: 2rem 0 1rem; color: var(--accent); }

    .subtitle { color: var(--text-muted); margin-bottom: 2rem; }

    .choice-cards {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.2rem;
    }

    .card h3 { font-size: 1rem; margin-bottom: 0.5rem; }
    .card p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.8rem; }

    .card code {
      display: block;
      background: var(--code-bg);
      padding: 0.6rem 0.8rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      overflow-x: auto;
    }

    .file-section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .file-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
    }

    .file-name {
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge {
      font-size: 0.7rem;
      background: var(--accent);
      color: var(--bg);
      padding: 0.1rem 0.5rem;
      border-radius: 10px;
      font-weight: 600;
    }

    .deps {
      font-size: 0.75rem;
      color: var(--orange);
    }

    .header-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .install-hint {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-family: "SFMono-Regular", Consolas, monospace;
    }

    .copy-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.15s;
    }

    .copy-btn:hover { border-color: var(--accent); color: var(--accent); }
    .copy-btn.copied { border-color: var(--green); color: var(--green); }

    .code-wrapper {
      padding: 1rem;
      overflow-x: auto;
    }

    pre { margin: 0; }

    code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.82rem;
      line-height: 1.5;
      color: var(--text);
    }

    .source-note {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }

    @media (max-width: 700px) {
      .choice-cards { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>@poc/my-utils</h1>
    <p class="subtitle">
      Utility functions with a single source of truth.
      Three ways to use — pick what fits your workflow.
    </p>

    <h2>Three ways to use</h2>
    <div class="choice-cards">
      <div class="card">
        <h3>📦 Package</h3>
        <p>Full npm package with types and updates.</p>
        <code>npm install @poc/my-utils</code>
      </div>
      <div class="card">
        <h3>🔧 CLI install</h3>
        <p>Resolves dependencies, writes .ts files to your project. No npm.</p>
        <code>${escapeHtml(cliExample)}</code>
      </div>
      <div class="card">
        <h3>📋 Copy-paste</h3>
        <p>Zero dependencies. Manual copy for simple cases.</p>
        <code>${escapeHtml(copyPasteImports)}</code>
      </div>
    </div>

    <h2>Source Files</h2>
    <p class="subtitle" style="margin-bottom:1rem;">
      These are the exact source files — the single source of truth.
      Files with dependencies show a <span style="color:var(--orange)">deps</span> hint and a CLI install command.
    </p>
${codeBlocks}

    <p class="source-note">
      Generated from <code>packages/my-utils/src/</code> — one source, three distribution methods.
    </p>
  </div>

  <script>
    async function copyCode(btn) {
      const targetId = btn.getAttribute("data-target");
      const code = document.getElementById(targetId).textContent;
      await navigator.clipboard.writeText(code);
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    }
  </script>
</body>
</html>
`;
}

// Main
const files = readSourceFiles(PACKAGE_SRC);
console.log(`Found ${files.length} source files in ${PACKAGE_SRC}`);

mkdirSync(OUTPUT_DIR, { recursive: true });
const html = generateHtml(files);
writeFileSync(join(OUTPUT_DIR, "index.html"), html, "utf-8");
console.log(`Generated ${join(OUTPUT_DIR, "index.html")}`);
