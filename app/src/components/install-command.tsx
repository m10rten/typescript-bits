"use client";

import { Button } from "#/ui/button";
import { cn } from "~/utils";
import { useState } from "react";

const PACKAGE_MANAGERS = ["npm", "pnpm", "bun", "deno"] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

type Mode = "install" | "run";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: "npm install typescript-bits",
  pnpm: "pnpm add typescript-bits",
  bun: "bun add typescript-bits",
  deno: "deno add npm:typescript-bits",
};

const RUN_COMMANDS: Record<PackageManager, string> = {
  npm: "npx typescript-bits",
  pnpm: "pnpx typescript-bits",
  bun: "bunx typescript-bits",
  deno: "deno run -A npm:typescript-bits",
};

export function InstallCommand({ module }: { module?: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);

  const mode: Mode = module ? "run" : "install";
  const command = mode === "install" ? INSTALL_COMMANDS[pm] : `${RUN_COMMANDS[pm]} ${module}`;

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">{mode === "install" ? "Install" : "Run"}</span>
        <div className="flex gap-1" role="group" aria-label="Package manager">
          {PACKAGE_MANAGERS.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={pm === name}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                pm === name
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              onClick={() => setPm(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <code className="flex-1 text-sm font-mono truncate select-all" style={{ fontVariantLigatures: "none" }}>
          $ {command}
        </code>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Copy ${mode} command for ${pm}`}
          onClick={() => {
            navigator.clipboard.writeText(command).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
