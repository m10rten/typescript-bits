import Link from "next/link";
import { Button } from "#/ui/button";
import { GitBranch } from "lucide-react";
import { getAllModules } from "../../scripts/source-files";
import { InstallHero } from "#/install-hero";
import { ModuleCard } from "#/module-card";

export default function Home() {
  const allModules = getAllModules();

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
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              Production-ready TypeScript utility primitives. Result, Atom, Queue, Safe, Retry, RichJSON, and reset
              type modules — zero-dependency, tree-shakeable, fully typed.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button nativeButton={false} render={<Link href="/docs" />}>
                Browse Modules &rarr;
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                render={<a href="https://github.com/m10rten/typescript-bits" target="_blank" />}>
                <GitBranch className="size-4" /> GitHub
              </Button>
            </div>

            <div className="mt-6 w-full max-w-lg">
              <InstallHero modules={allModules.map((m) => m.name)} />
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
            <ModuleCard
              key={m.name}
              name={m.name}
              href={`/docs/${m.name}`}
              deps={m.children ? undefined : m.imports.length}
              submodules={m.children?.length}
              compact>
              {m.description}
            </ModuleCard>
          ))}
        </div>
      </section>
    </div>
  );
}
