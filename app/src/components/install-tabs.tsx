"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/ui/tabs";
import { CommandLine } from "#/command-line";
import { CodeCopyButton } from "#/copy-button";

interface InstallTabsProps {
  command: string;
  prompt: string;
}

export function InstallTabs({ command, prompt }: InstallTabsProps) {
  return (
    <Tabs defaultValue="npx" className="gap-3">
      <TabsList variant="line">
        <TabsTrigger value="npx" className="px-3 py-1 font-mono text-[13px]">
          npx
        </TabsTrigger>
        <TabsTrigger value="prompt" className="px-3 py-1 font-mono text-[13px]">
          prompt
        </TabsTrigger>
      </TabsList>

      {/* npx panel */}
      <TabsContent value="npx">
        <div className="group relative rounded-xl border border-border dark:border-zinc-800/50 bg-card dark:bg-zinc-950 shadow-lg overflow-hidden transition-all hover:border-border/80 dark:hover:border-zinc-700/50">
          <div className="flex items-center gap-1.5 border-b border-border dark:border-zinc-800/50 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">bash</span>
          </div>
          <div className="px-4 py-3.5 sm:px-5 sm:py-4">
            <CommandLine command={command} label="npx" />
          </div>
        </div>
      </TabsContent>

      {/* prompt panel — same chrome as npx */}
      <TabsContent value="prompt">
        <div className="group relative rounded-xl border border-border dark:border-zinc-800/50 bg-card dark:bg-zinc-950 shadow-lg overflow-hidden transition-all hover:border-border/80 dark:hover:border-zinc-700/50">
          <div className="flex items-center border-b border-border dark:border-zinc-800/50 px-4 py-2.5">
            <span className="text-xs text-muted-foreground font-mono">prompt</span>
            <CodeCopyButton
              source={prompt}
              label="Copy"
              className="ml-auto h-7 gap-1 px-2 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2"
            />
          </div>
          <div className="px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap select-all">{prompt}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
