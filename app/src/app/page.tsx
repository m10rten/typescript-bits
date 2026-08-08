import Link from "next/link";
import { Button } from "#/ui/button";
import { Badge } from "#/ui/badge";
import { ArrowRight, GitBranch } from "lucide-react";
import { getAllBlogs, getAllModules, getAllSkills } from "../../scripts/source-files";
import { InstallHero } from "#/install-hero";
import { Card } from "#/card";
import { ExternalLink } from "#/external-link";
import { featuredModules, featuredSkills } from "@/config/featured";
import { Hero } from "#/hero";

export default function Home() {
  const allModules = getAllModules();
  const allSkills = getAllSkills();
  const allBlogs = getAllBlogs();
  const latestBlogs = allBlogs.slice(0, 3);

  const featuredModuleList = featuredModules
    .map((name) => allModules.find((m) => m.name === name))
    .filter((m): m is NonNullable<typeof m> => m != null);

  const featuredSkillList = featuredSkills
    .map((name) => allSkills.find((s) => s.name === name))
    .filter((s): s is NonNullable<typeof s> => s != null);

  return (
    <div className="flex flex-col flex-1">
      <Hero intensity="default">
        <div className="flex flex-col items-start gap-4 max-w-3xl">
          {/* Wordmark demoted to eyebrow/kicker label */}
          <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase">
            typescript-bits
          </span>

          {/* H1 — value proposition promoted from the former subhead */}
          <h1 id="hero-title" className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            <span className="text-accent-strong">Production-grade</span>&nbsp;TypeScript primitives &amp; agent skills
          </h1>

          {/* Subhead — foreground/80 for AA contrast over the gradient region */}
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl text-balance">
            Zero-dependency, tree-shakeable, fully typed, and rigorously tested — install once, use everywhere.
          </p>

          <div className="flex flex-wrap gap-3 mt-2">
            <Button nativeButton={false} render={<Link href="/docs" />}>
              Browse Docs
              {/* Icon carries the directional affordance; aria-hidden so SR skips it */}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              render={<ExternalLink href="https://github.com/m10rten/typescript-bits" />}>
              <GitBranch className="size-4" aria-hidden="true" /> View on GitHub
            </Button>
          </div>

          {/* Install command — co-primary weight, directly under CTAs */}
          <div className="mt-4 w-full max-w-lg">
            <InstallHero />
          </div>
        </div>
      </Hero>

      <section aria-labelledby="skills-title" className="container-main py-12 md:py-16">
        <h2 id="skills-title" className="text-2xl font-semibold mb-6">
          Agent Skills
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-prose">
          Reusable agent skill instructions — extend OpenCode, Codex, Claude Code, and 50+ other AI coding agents with
          project-specific knowledge.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredSkillList.map((s) => (
            <Card key={s.name} title={s.displayName} href={`/docs/skills/${s.name}`} size="sm">
              {s.description}
            </Card>
          ))}
        </div>
        <div className="mt-4 flex justify-start">
          <Link
            href="/docs/skills"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            See all {allSkills.length} skills
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="modules-title" className="container-main pb-12 md:pb-16">
        <h2 id="modules-title" className="text-2xl font-semibold mb-6">
          Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredModuleList.map((m) => (
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
        <div className="mt-4 flex justify-start">
          <Link
            href="/docs/modules"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            See all {allModules.length} modules
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="blog-title" className="container-main pb-12 md:pb-16">
        <h2 id="blog-title" className="text-2xl font-semibold mb-6">
          Blog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {latestBlogs.map((post) => (
            <Card
              key={post.name}
              title={post.title}
              description={post.description}
              href={`/blog/${post.name}`}
              size="sm"
            />
          ))}
        </div>
        {allBlogs.length > 0 && (
          <div className="mt-4 flex justify-start">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
              See all {allBlogs.length} posts
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
