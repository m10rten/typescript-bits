"use client";

import { useState } from "react";
import { CodeCopyButton } from "#/copy-button";
import { cn } from "~/utils";

type Mode = "install" | "source" | "copy";

const MODE_LABELS: Record<Mode, string> = {
  install: "Install package",
  source: "Install source",
  copy: "Copy source",
};

const INSTALL_ENTRIES = [
  { id: "pnpm", label: "pnpm", command: "pnpm add typescript-bits" },
  { id: "bun", label: "bun", command: "bun add typescript-bits" },
  { id: "npm", label: "npm", command: "npm install typescript-bits" },
  { id: "yarn", label: "yarn", command: "yarn add typescript-bits" },
  { id: "deno", label: "deno", command: "deno add npm:typescript-bits" },
];

function cliEntries(module: string) {
  return [
    { id: "npm", label: "npx", command: `npx typescript-bits ${module}` },
    { id: "pnpm", label: "pnpx", command: `pnpx typescript-bits ${module}` },
    { id: "bun", label: "bunx", command: `bunx typescript-bits ${module}` },
    { id: "deno", label: "deno", command: `deno run -A npm:typescript-bits ${module}` },
    { id: "yarn", label: "yarn", command: `yarn dlx typescript-bits ${module}` },
  ];
}

export function InstallHero({ modules = ["atom"] }: { modules?: string[] }) {
  const [mode, setMode] = useState<Mode>("install");
  const [installPm, setInstallPm] = useState("pnpm");
  const [cliPm, setCliPm] = useState("npm");
  const [cliModule, setCliModule] = useState(modules[0] ?? "atom");

  const selectedInstall = INSTALL_ENTRIES.find((e) => e.id === installPm) ?? INSTALL_ENTRIES[0];
  const cliOptions = cliEntries(cliModule);
  const selectedCli = cliOptions.find((e) => e.id === cliPm) ?? cliOptions[0];

  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      {/* Top bar: mode tabs left, dropdown(s) right */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex">
          {(["install", "source", "copy"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              className={cn(
                "px-4 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              onClick={() => setMode(m)}>
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pr-4">
          {mode === "install" && (
            <select
              value={installPm}
              onChange={(e) => setInstallPm(e.target.value)}
              className="bg-muted text-sm text-foreground border border-border rounded px-2.5 py-1 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="Package manager">
              {INSTALL_ENTRIES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
          )}
          {mode === "source" && (
            <select
              value={cliPm}
              onChange={(e) => setCliPm(e.target.value)}
              className="bg-muted text-sm text-foreground border border-border rounded px-2.5 py-1 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="CLI runner">
              {cliOptions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Command row: command + copy button side by side */}
      {mode === "install" && (
        <div className="flex items-center justify-between px-5 py-4 gap-3">
          <code
            className="flex-1 font-mono text-base select-all text-foreground truncate"
            style={{ fontVariantLigatures: "none" }}>
            $ {selectedInstall.command}
          </code>
          <CodeCopyButton source={selectedInstall.command} label={selectedInstall.label} />
        </div>
      )}

      {/* Source command row: inline module selector */}
      {mode === "source" && (
        <div className="flex items-center justify-between px-5 py-4 gap-3">
          <code
            className="flex items-center gap-1 font-mono text-base select-all text-foreground min-w-0"
            style={{ fontVariantLigatures: "none" }}>
            <span className="shrink-0">$ {selectedCli.command.split(" ").slice(0, -1).join(" ")}</span>
            {modules.length > 0 && (
              <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-base font-mono">
                <select
                  value={cliModule}
                  onChange={(e) => setCliModule(e.target.value)}
                  className="appearance-none bg-transparent text-foreground font-mono border-none p-0 m-0 focus-visible:outline-none cursor-pointer"
                  aria-label="Module">
                  {modules.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            )}
          </code>
          <CodeCopyButton source={selectedCli.command} label={selectedCli.label} />
        </div>
      )}

      {/* Copy source */}
      {mode === "copy" && (
        <div className="px-5 py-6 text-center text-sm text-muted-foreground">
          Navigate to any{" "}
          <a href="/docs" className="underline underline-offset-2 hover:text-foreground transition-colors">
            module page
          </a>
          , switch to <strong>Copy Source</strong> view, and copy the highlighted code directly into your project.
        </div>
      )}
    </div>
  );
}
