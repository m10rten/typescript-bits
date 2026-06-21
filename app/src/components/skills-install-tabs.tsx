"use client";

import { InstallTabs } from "#/install-tabs";

interface SkillsInstallTabsProps {
  repo: string;
}

export function SkillsInstallTabs({ repo }: SkillsInstallTabsProps) {
  const command = `npx skills add ${repo}`;
  const prompt = `Add all skills from the typescript-bits repository to my AI coding agent.

Install: \`npx skills add ${repo}\`
Docs: https://ts.mvdlei.nl/docs/skills
Project context (llms.txt): https://ts.mvdlei.nl/llms.txt

Please help me set up these skills.`.trim();

  return <InstallTabs command={command} prompt={prompt} />;
}
