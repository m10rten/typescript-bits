"use client";

import { InstallTabs } from "#/install-tabs";

interface SkillInstallTabsProps {
  skillCmd: string;
  prompt: string;
}

export function SkillInstallTabs({ skillCmd, prompt }: SkillInstallTabsProps) {
  return <InstallTabs command={skillCmd} prompt={prompt} />;
}
