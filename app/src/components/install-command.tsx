"use client";

import { Button } from "#/ui/button";
import { cn } from "~/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "$/use-copy-to-clipboard";

const PACKAGE_MANAGERS = ["npm", "pnpm", "bun", "deno"] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: "npm install typescript-bits",
  pnpm: "pnpm add typescript-bits",
  bun: "bun add typescript-bits",
  deno: "deno add npm:typescript-bits",
};

const COPY_COMMANDS: Record<PackageManager, string> = {
  npm: "npx typescript-bits",
  pnpm: "pnpx typescript-bits",
  bun: "bunx typescript-bits",
  deno: "deno run -A npm:typescript-bits",
};

type Mode = "install" | "copy";

const MODE_LABELS: Record<Mode, string> = {
  install: "Install package",
  copy: "Copy source",
};

export function InstallCommand({ module }: { module?: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [mode, setMode] = useState<Mode>(module ? "copy" : "install");
  const { copied, copy } = useCopyToClipboard();

  const command = mode === "install" ? INSTALL_COMMANDS[pm] : `${COPY_COMMANDS[pm]}${module ? ` ${module}` : ""}`;

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2">
        <div className="flex gap-1" role="group" aria-label="Install method">
          {(["install", "copy"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              disabled={!module && m === "copy"}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                mode === m
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                !module && m === "copy" && "opacity-40 cursor-not-allowed",
              )}
              onClick={() => setMode(m)}>
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
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
        <code
          className="flex-1 text-xs sm:text-sm font-mono truncate select-all"
          style={{ fontVariantLigatures: "none" }}>
          $ {command}
        </code>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Copy ${mode} command for ${pm}`}
          onClick={() => copy(command)}>
          {copied ? <Check className="size-3.5 text-green-400 sm:hidden" /> : <Copy className="size-3.5 sm:hidden" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
        </Button>
      </div>
    </div>
  );
}
