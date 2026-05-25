import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "#/ui/breadcrumb";
import { InstallCommand } from "#/install-command";
import { highlightCode } from "../../../../scripts/source-files";
import Link from "next/link";
import { CopyLine } from "./copy-line";

export default async function InstallationPage() {
  const highlightedImport = await highlightCode(`import { atom, type Atom } from "typescript-bits/atom";`, "ts");
  const highlightedCli = await highlightCode("npx typescript-bits atom --path src/lib/bits", "bash");

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

      <div className="max-w-md">
        <InstallCommand />
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mt-6">Import a module</h2>
        <p>Each module is a standalone file — import it directly from its source path:</p>
        <CopyLine code={`import { atom, type Atom } from "typescript-bits/atom";`} highlighted={highlightedImport} />

        <h2 className="text-xl font-semibold mt-8">Copy a module as source</h2>
        <p>
          Copy individual modules into your project as editable source files. Dependencies are resolved and included
          automatically.
        </p>
        <CopyLine code="npx typescript-bits atom" highlighted={highlightedCli} />
        <p className="text-sm text-muted-foreground">
          Files are written to <code>src/lib/bits/</code> by default. Use <code>--path</code> to customize:
        </p>
        <CopyLine
          code="npx typescript-bits atom --path vendor"
          highlighted={await highlightCode("npx typescript-bits atom --path vendor", "bash")}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Run without arguments for an interactive picker. Press{" "}
          <kbd className="px-1 py-0.5 rounded border bg-muted text-xs font-mono">A</kbd> to toggle all modules.
        </p>

        <h2 className="text-xl font-semibold mt-8">Custom output path</h2>
        <p>
          To set a persistent custom path, add a <code>components.json</code> to your project:
        </p>
        <CopyLine
          code={`{ "aliases": { "bits": "src/lib/bits" } }`}
          highlighted={await highlightCode(`{ "aliases": { "bits": "src/lib/bits" } }`, "bash")}
        />
        <p className="text-sm text-muted-foreground">
          The CLI reads the <code>aliases.bits</code> value and uses it as the default output path.
        </p>

        <h2 className="text-xl font-semibold mt-8">Package details</h2>
        <ul className="space-y-2 list-disc pl-5">
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
