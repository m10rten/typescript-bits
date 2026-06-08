import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "#/ui/breadcrumb";
import { InstallDropdown } from "#/install-dropdown";
import { CommandLine } from "#/command-line";
import { highlightCode } from "../../../../scripts/source-files";
import Link from "next/link";
import { CopyLine } from "./copy-line";

export const pageContent =
  "Three ways to use a module: Install Package via npm yarn pnpm bun from node_modules. " +
  "Install Source via CLI — copy into project as editable source file, dependencies resolved automatically. " +
  "Copy Source — navigate to module page, switch to Copy Source view, and copy highlighted code directly. " +
  "Agent skills install via npx skills add m10rten/typescript-bits. " +
  "ESM only — published as a native ES module package. Node.js 22+ required. TypeScript 5.7+. " +
  "No bundler required — works with Node Bun Deno and all major bundlers. " +
  "Source fetched from GitHub — CLI fetches module sources at runtime. " +
  "CLI supports --path to customize output directory and interactive picker with A to toggle all. " +
  "components.json with aliases.bits sets a persistent custom output path.";

export default async function InstallationPage() {
  const packageImport = await highlightCode(`import { atom, type Atom } from "typescript-bits/atom";`, "ts");
  const localImport = await highlightCode(`import { atom, type Atom } from "../lib/bits/atom";`, "ts");

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Installation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold tracking-tight">Installation</h1>

      <p className="text-muted-foreground max-w-prose">
        There are three ways to use a module — pick the one that fits your project.
      </p>

      {/* Install Package */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Install Package</h2>
        <p className="text-sm text-muted-foreground">
          Use a package manager to install <code>typescript-bits</code> and import modules from{" "}
          <code>node_modules</code>. Best for projects that already use npm/yarn/pnpm/bun.
        </p>
        <div className="max-w-md">
          <InstallDropdown module="atom" mode="install" />
        </div>
        <p className="text-sm text-muted-foreground">Then import the module by name:</p>
        <CopyLine code={`import { atom, type Atom } from "typescript-bits/atom";`} highlighted={packageImport} />
      </div>

      {/* Install Source */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Install Source</h2>
        <p className="text-sm text-muted-foreground">
          Copy a module into your project as an editable source file via the CLI. Dependencies are resolved and bundled
          automatically. Best when you want to own and modify the code.
        </p>
        <div className="max-w-md">
          <InstallDropdown module="atom" mode="cli" />
        </div>
        <p className="text-sm text-muted-foreground">
          Files are written to <code>src/lib/bits/</code> by default. Use <code>--path</code> to customize. Run without
          arguments for an interactive picker. Press{" "}
          <kbd className="px-1 py-0.5 rounded border bg-muted text-xs font-mono">A</kbd> to toggle all modules.
        </p>
        <p className="text-sm text-muted-foreground">Then import from the local path:</p>
        <CopyLine code={`import { atom, type Atom } from "../lib/bits/atom";`} highlighted={localImport} />
        <p className="text-sm text-muted-foreground">
          To set a persistent custom path, add a <code>components.json</code> to your project:
        </p>
        <CopyLine
          code={`{ "aliases": { "bits": "src/lib/bits" } }`}
          highlighted={await highlightCode(`{ "aliases": { "bits": "src/lib/bits" } }`, "bash")}
        />
        <p className="text-sm text-muted-foreground">
          The CLI reads the <code>aliases.bits</code> value and uses it as the default output path.
        </p>
      </div>

      {/* Copy Source */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Copy Source</h2>
        <p className="text-sm text-muted-foreground">
          Navigate to any{" "}
          <Link href="/docs" className="underline underline-offset-2 hover:text-foreground transition-colors">
            module page
          </Link>
          , switch to <strong>Copy Source</strong> view, and copy the highlighted code directly. No install or CLI
          needed — best for quick experiments or one-off use.
        </p>
        <p className="text-sm text-muted-foreground">Usage is shown inline without any import — the code is yours:</p>
        <CopyLine
          code={`const ok = Result.ok(10);\nconsole.log(ok.value); // 10`}
          highlighted={await highlightCode(`const ok = Result.ok(10);\nconsole.log(ok.value); // 10`, "ts")}
        />
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Agent skills extend AI coding agents (OpenCode, Codex, Claude Code, and 50+ others) with project-specific
          knowledge. Install via the skills CLI:
        </p>
        <div className="max-w-md">
          <div className="rounded-lg border bg-card text-card-foreground">
            <div className="border-b px-4 py-2 text-xs font-medium text-muted-foreground">Install</div>
            <div className="px-4 py-3">
              <CommandLine command="npx skills add m10rten/typescript-bits" label="npx" />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          This installs all available skills. To install a single skill, append{" "}
          <code className="text-xs font-mono">--skill &lt;skill-name&gt;</code>. See all skills on the{" "}
          <Link href="/docs/skills" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Skills overview page
          </Link>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          Skills are auto-discovered from the <code className="text-xs font-mono">skills/</code> directory — no
          configuration needed. Each skill is a <code className="text-xs font-mono">SKILL.md</code> file with YAML
          frontmatter.
        </p>
      </div>

      {/* Package details */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Package details</h2>
        <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
          <li>
            <strong>ESM only</strong> — published as a native ES module package (<code>"type": "module"</code>).
          </li>
          <li>
            <strong>Node.js 22+</strong> — requires a modern Node runtime.
          </li>
          <li>
            <strong>TypeScript 5.7+</strong> — ships with <code>.d.ts</code> declarations.
          </li>
          <li>
            <strong>No bundler required</strong> — import patterns work with Node, Bun, Deno, and all major bundlers.
          </li>
          <li>
            <strong>Source fetched from GitHub</strong> — the CLI fetches module sources at runtime; no source files
            are bundled with the package.
          </li>
        </ul>
      </div>
    </div>
  );
}
