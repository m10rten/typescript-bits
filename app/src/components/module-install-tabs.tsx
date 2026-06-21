"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/ui/tabs";
import { CommandLine } from "#/command-line";

interface ModuleInstallTabsProps {
  module: string;
}

export function ModuleInstallTabs({ module: moduleName }: ModuleInstallTabsProps) {
  const scopedModule = moduleName.split("/")[0] ?? "";
  const installCmd = "npm install typescript-bits";
  const scopedCmd = `npm install @typescript-bits/${scopedModule}`;

  const terminalCard = (cmd: string, label: string) => (
    <div className="group relative rounded-xl border border-border dark:border-zinc-800/50 bg-card dark:bg-zinc-950 shadow-lg overflow-hidden transition-all hover:border-border/80 dark:hover:border-zinc-700/50">
      <div className="flex items-center gap-1.5 border-b border-border dark:border-zinc-800/50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">{label}</span>
      </div>
      <div className="px-4 py-3.5 sm:px-5 sm:py-4">
        <CommandLine command={cmd} label="npm" />
      </div>
    </div>
  );

  return (
    <Tabs defaultValue="npm" className="gap-3">
      <TabsList variant="line">
        <TabsTrigger value="npm" className="px-3 py-1 font-mono text-[13px]">
          npm
        </TabsTrigger>
        <TabsTrigger value="scoped" className="px-3 py-1 font-mono text-[13px]">
          scoped
        </TabsTrigger>
      </TabsList>
      <TabsContent value="npm">{terminalCard(installCmd, "bash")}</TabsContent>
      <TabsContent value="scoped">{terminalCard(scopedCmd, "bash")}</TabsContent>
    </Tabs>
  );
}
