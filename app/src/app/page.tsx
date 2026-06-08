import Link from "next/link";
import { Button } from "#/ui/button";
import { Badge } from "#/ui/badge";
import { GitBranch } from "lucide-react";
import { getAllModules, getAllSkills } from "../../scripts/source-files";
import { InstallHero } from "#/install-hero";
import { Card } from "#/card";
import { ExternalLink } from "#/external-link";

function buildHeroDescription(): string {
  return `Production-grade TypeScript primitives and AI agent skills — zero-dependency, tree-shakeable, fully typed, and rigorously tested.`;
}

export default function Home() {
  const allModules = getAllModules();
  const allSkills = getAllSkills();

  return (
    <div className="flex flex-col flex-1">
      <section aria-labelledby="hero-title" className="hero-bg relative overflow-hidden">
        {/* Background gradient blobs */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, oklch(0 0 0 / 0.03) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full bg-chart-2/8 blur-[100px] -z-10"
          aria-hidden="true"
        />

        <div className="container-main py-16 md:py-24">
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <h1 id="hero-title" className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              typescript-bits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">{buildHeroDescription()}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button nativeButton={false} render={<Link href="/docs" />}>
                Browse Docs &rarr;
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                render={<ExternalLink href="https://github.com/m10rten/typescript-bits" />}>
                <GitBranch className="size-4" /> GitHub
              </Button>
            </div>

            <div className="mt-6 w-full max-w-lg">
              <InstallHero />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="modules-title" className="container-main py-12 md:py-16">
        <h2 id="modules-title" className="text-2xl font-semibold mb-6">
          Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allModules.map((m) => (
            <Card
              key={m.name}
              title={m.name}
              href={`/docs/${m.name}`}
              size="sm"
              badges={
                <>
                  {m.imports.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {m.imports.length} link{m.imports.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {m.children && m.children.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {m.children.length} submodule{m.children.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </>
              }>
              {m.description}
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="skills-title" className="container-main pb-12 md:pb-16">
        <h2 id="skills-title" className="text-2xl font-semibold mb-6">
          Agent Skills
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-prose">
          Reusable agent skill instructions — extend OpenCode, Codex, Claude Code, and 50+ other AI coding agents with
          project-specific knowledge.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allSkills.map((s) => (
            <Card key={s.name} title={s.displayName} href={`/docs/skills/${s.name}`} size="sm">
              {s.description}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
