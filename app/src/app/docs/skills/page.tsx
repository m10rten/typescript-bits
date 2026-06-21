import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { Card } from "#/card";
import { SkillsInstallTabs } from "#/skills-install-tabs";
import { getAllSkills } from "../../../../scripts/source-files";
import ExternalLink from "#/external-link";

const SKILLS_REPO = "m10rten/typescript-bits";

function formatTokenCount(count: number): string {
  if (count < 1000) return String(count);
  const k = count / 1000;
  // Trim trailing ".0" so 1000 → "1k", 1100 → "1.1k"
  return `${parseFloat(k.toFixed(1))}k`;
}

function clampSkillTitle(title: string): string {
  // Display up to the first comma or end
  const idx = title.indexOf(",");
  return idx === -1 ? title : title.slice(0, idx);
}

export default async function SkillsOverviewPage() {
  const skills = getAllSkills();

  return (
    <div className="flex flex-col container-main py-8 gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">~</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/introduction">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Skills</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold tracking-tight">Agent Skills</h1>
            <Badge variant="secondary">Cross-platform</Badge>
          </div>
          <p className="text-muted-foreground max-w-prose">
            Reusable agent skill instructions that extend AI coding agents with project-specific knowledge. Skills
            follow the{" "}
            <ExternalLink
              href="https://github.com/vercel-labs/skills"
              className="underline underline-offset-2 hover:text-foreground transition-colors">
              Agent Skills Specification
            </ExternalLink>{" "}
            and work across OpenCode, Codex, Claude Code, and 50+ other agents.
          </p>
        </div>

        {/* Install command */}
        <SkillsInstallTabs repo={SKILLS_REPO} />

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            npx
          </Badge>
          <Badge variant="outline" className="text-xs">
            OpenCode
          </Badge>
          <Badge variant="outline" className="text-xs">
            Codex
          </Badge>
          <Badge variant="outline" className="text-xs">
            Claude Code
          </Badge>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Available Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <Card
                key={skill.name}
                title={skill.displayName}
                href={`/docs/skills/${skill.name}`}
                size="sm"
                badges={
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-purple-300/60 text-purple-400 leading-none">
                    {formatTokenCount(skill.tokenCount)}
                  </span>
                }>
                {clampSkillTitle(skill.description)}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Adding New Skills */}
      <div className="flex flex-col gap-3 pt-4 border-t">
        <h2 className="text-xl font-semibold tracking-tight">Adding New Skills</h2>
        <p className="text-sm text-muted-foreground">
          Create a subdirectory under <code>skills/&lt;skill-name&gt;/</code> with a <code>SKILL.md</code> containing
          YAML frontmatter (<code>name</code>, <code>description</code>) and markdown instructions. The{" "}
          <code>skills</code> CLI auto-discovers new skills — no configuration needed.
        </p>
      </div>
    </div>
  );
}
