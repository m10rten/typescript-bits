import Link from "next/link";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { Card } from "#/card";
import { getAllModules, getAllSkills } from "../../../../scripts/source-files";

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
  const skills = getAllSkills();
  const moduleList = buildModulesDescription();
  const skillList =
    skills.length > 0
      ? " Agent skills: " + skills.map((s) => `${s.displayName} — ${s.description}`).join(", ") + "."
      : "";
  return (
    "A collection of production-ready TypeScript utility primitives — zero-dependency building blocks for everyday patterns. " +
    "Design principles: Zero dependencies, Tree-shakeable by default, Strict TypeScript, Production first. " +
    "Every module is a standalone .ts file you can import directly. No bundler magic, no barrel exports. " +
    moduleList +
    skillList
  );
}

export default function IntroductionPage() {
  const allModules = getAllModules();
  const allSkills = getAllSkills();

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
            <Card
              key={m.name}
              title={m.displayName}
              href={`/docs/${m.name}`}
              badges={
                <>
                  {m.imports.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {m.imports.length} dep{m.imports.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {m.children && m.children.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {m.children.length} sub
                    </Badge>
                  )}
                </>
              }>
              {m.description}
            </Card>
          ))}
        </div>

        {allSkills.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-10">Agent skills</h2>
            <p>
              Reusable instructions that extend AI coding agents with project-specific knowledge. Compatible with
              OpenCode, Codex, Claude Code, and 50+ other agents.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {allSkills.map((s) => (
                <Card key={s.name} title={s.displayName} href={`/docs/skills/${s.name}`} size="sm">
                  {s.description}
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              See all skills on the{" "}
              <Link
                href="/docs/skills"
                className="underline underline-offset-2 hover:text-foreground transition-colors">
                Skills overview page
              </Link>
              .
            </p>
          </>
        )}

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
