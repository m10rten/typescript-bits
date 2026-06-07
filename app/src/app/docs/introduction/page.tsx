import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#/ui/breadcrumb";
import { ModuleCard } from "#/module-card";
import { getAllModules } from "../../../../scripts/source-files";

function buildModulesDescription(): string {
  const modules = getAllModules();
  return (
    "Modules include: " +
    modules
      .map((m) => `${m.displayName} ${m.description.charAt(0).toLowerCase() + m.description.slice(1)}`)
      .join(", ") +
    "."
  );
}

export function pageContent(): string {
  const modules = getAllModules();
  const moduleList = buildModulesDescription();
  return (
    "A collection of production-ready TypeScript utility primitives — zero-dependency building blocks for everyday patterns. " +
    "Design principles: Zero dependencies, Tree-shakeable by default, Strict TypeScript, Production first. " +
    "Every module is a standalone .ts file you can import directly. No bundler magic, no barrel exports. " +
    moduleList
  );
}

export default function IntroductionPage() {
  const allModules = getAllModules();

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground">
          A collection of production-ready TypeScript utility primitives — zero-dependency building blocks for everyday
          patterns.
        </p>

        <h2 className="text-xl font-semibold mt-8">What's inside</h2>
        <p>
          Every module is a standalone <code>.ts</code> file you can import directly. No bundler magic, no barrel
          exports — just pick what you need.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {allModules.map((m) => (
            <ModuleCard
              key={m.name}
              name={m.displayName}
              href={`/docs/${m.name}`}
              deps={m.imports.length}
              submodules={m.children?.length}>
              {m.description}
            </ModuleCard>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-10">Design principles</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <strong>Zero dependencies</strong> — every module is self-contained or imports from sibling modules only.
          </li>
          <li>
            <strong>Tree-shakeable by default</strong> — import only what you use, no bundler overhead.
          </li>
          <li>
            <strong>Strict TypeScript</strong> — full type safety with <code>strict: true</code> throughout.
          </li>
          <li>
            <strong>Production first</strong> — every piece is tested and ready for real-world use.
          </li>
        </ul>
      </div>
    </div>
  );
}
