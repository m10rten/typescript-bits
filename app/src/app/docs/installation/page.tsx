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
  const highlightedCli = await highlightCode("npx typescript-bits atom", "bash");

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

        <h2 className="text-xl font-semibold mt-8">Install a single module</h2>
        <p>Install a single module locally using the CLI:</p>
        <CopyLine code="npx typescript-bits atom" highlighted={highlightedCli} />
        <p className="text-sm text-muted-foreground">
          Replace <code>atom</code> with any module name. See the{" "}
          <Link href="/docs" className="underline hover:text-foreground">
            module list
          </Link>{" "}
          for available options.
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
        </ul>
      </div>
    </div>
  );
}
