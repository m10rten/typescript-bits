import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "#/ui/breadcrumb";
import { Badge } from "#/ui/badge";
import { getSkillNames, getSkillContent } from "../../../../../scripts/source-files";
import { renderMarkdown } from "~/render-markdown";
import { CodeBlock } from "#/code-block";
import { ScrollProgress } from "#/scroll-progress";
import { BackToTop } from "#/back-to-top";
import { CodeCopyButton } from "#/copy-button";
import { SkillInstallTabs } from "#/skill-install-tabs";

function formatTokenCount(count: number): string {
  if (count < 1000) return String(count);
  const k = count / 1000;
  return `${parseFloat(k.toFixed(1))}k`;
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
  const { skill: skillName } = await params;
  let skill;
  try {
    skill = getSkillContent(skillName);
  } catch {
    notFound();
  }
  return {
    title: `${skill.displayName} — typescript-bits skills`,
    description: skill.description,
    openGraph: { title: skill.displayName, description: skill.description },
    twitter: { title: skill.displayName, description: skill.description },
  };
}

export function generateStaticParams() {
  return getSkillNames().map((name) => ({ skill: name }));
}

export default async function SkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill: skillName } = await params;
  let skill;
  try {
    skill = getSkillContent(skillName);
  } catch {
    notFound();
  }

  const contentChunks = await renderMarkdown(skill.content);

  const aiPrompt = `Load the "${skill.displayName}" skill from typescript-bits into my AI coding agent.

Skill: ${skill.name}
Description: ${skill.description}
Install: \`npx skills add m10rten/typescript-bits --skill ${skill.name}\`
Docs: https://ts.mvdlei.nl/docs/skills/${skill.name}

Project context (llms.txt): https://ts.mvdlei.nl/llms.txt

Please help me set up this skill.`.trim();

  return (
    <>
      <ScrollProgress />
      <div className="flex flex-col container-main py-8 gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/skills">Skills</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{skill.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{skill.displayName}</h1>
          <p className="text-muted-foreground">{skill.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            OpenCode
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Codex
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Claude Code
          </Badge>
        </div>

        {/* Install */}
        <SkillInstallTabs
          skillCmd={`npx skills add m10rten/typescript-bits --skill ${skill.name}`}
          prompt={aiPrompt}
        />

        {/* Skill content */}
        <div className="flex flex-col gap-0">
          <div className="w-[85%] mx-auto border-t border-border" />
          <div className="flex items-center justify-between gap-2 pt-4 ">
            <span className="text-xs text-muted-foreground flex items-center gap-2">
              <code className="font-mono">skill.md</code> &middot; {skill.lineCount} lines
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-purple-300/60 text-purple-400 leading-none">
                ~{formatTokenCount(skill.tokenCount)}
              </span>
            </span>
            <CodeCopyButton
              source={skill.content}
              label="Copy Content"
              className="h-7 gap-1 px-2 rounded-md border border-border bg-background text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 shrink-0"
            />
          </div>
          <div className="max-w-none">
            {contentChunks.map((chunk, i) => {
              if (chunk.type === "code") {
                return (
                  <div key={i} className="my-4">
                    <CodeBlock html={chunk.html} code={chunk.code} lang={chunk.lang} />
                  </div>
                );
              }
              return <div key={i} dangerouslySetInnerHTML={{ __html: chunk.html }} />;
            })}
          </div>
        </div>
        <BackToTop />
      </div>
    </>
  );
}
