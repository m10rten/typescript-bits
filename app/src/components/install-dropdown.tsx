"use client";

import { useState } from "react";
import { CodeCopyButton } from "#/copy-button";

type Entry = { id: string; label: string; command: string };

const INSTALL_ENTRIES: Entry[] = [
  { id: "pnpm", label: "pnpm", command: "pnpm add typescript-bits" },
  { id: "bun", label: "bun", command: "bun add typescript-bits" },
  { id: "npm", label: "npm", command: "npm install typescript-bits" },
  { id: "yarn", label: "yarn", command: "yarn add typescript-bits" },
  { id: "deno", label: "deno", command: "deno add npm:typescript-bits" },
];

function cliEntries(module: string): Entry[] {
  return [
    { id: "npm", label: "npx", command: `npx typescript-bits ${module}` },
    { id: "pnpm", label: "pnpx", command: `pnpx typescript-bits ${module}` },
    { id: "bun", label: "bunx", command: `bunx typescript-bits ${module}` },
    { id: "deno", label: "deno", command: `deno run -A npm:typescript-bits ${module}` },
  ];
}

export function InstallDropdown({
  module: moduleName,
  mode,
}: {
  module?: string;
  /** Show only the install section or only the CLI section */
  mode?: "install" | "cli";
}) {
  const [installPm, setInstallPm] = useState<string>(INSTALL_ENTRIES[0].id);
  const [cliPm, setCliPm] = useState<string>("npm");

  const selectedInstall = INSTALL_ENTRIES.find((e) => e.id === installPm) ?? INSTALL_ENTRIES[0];
  const cliOptions = moduleName ? cliEntries(moduleName) : [];
  const selectedCli = cliOptions.find((e) => e.id === cliPm) ?? cliOptions[0];

  const showInstall = !mode || mode === "install";
  const showCli = moduleName && (!mode || mode === "cli");

  return (
    <div className="flex flex-col gap-3">
      {/* Package install */}
      {showInstall && (
        <div className="rounded-lg border bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">install</span>
              <select
                value={installPm}
                onChange={(e) => setInstallPm(e.target.value)}
                className="bg-zinc-900 text-xs text-zinc-300 border border-zinc-700 rounded px-2 py-0.5 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label="Package manager">
                {INSTALL_ENTRIES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
            <CodeCopyButton source={selectedInstall.command} label={selectedInstall.label} />
          </div>
          <div
            className="px-4 py-3 font-mono text-sm text-zinc-200 select-all"
            style={{ fontVariantLigatures: "none" }}>
            {selectedInstall.command}
          </div>
        </div>
      )}

      {/* CLI copy-install */}
      {showCli && (
        <div className="rounded-lg border bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">local source</span>
              <select
                value={cliPm}
                onChange={(e) => setCliPm(e.target.value)}
                className="bg-zinc-900 text-xs text-zinc-300 border border-zinc-700 rounded px-2 py-0.5 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label="CLI runner">
                {cliOptions.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
            <CodeCopyButton source={selectedCli.command} label={selectedCli.label} />
          </div>
          <div
            className="px-4 py-3 font-mono text-sm text-zinc-200 select-all"
            style={{ fontVariantLigatures: "none" }}>
            {selectedCli.command}
          </div>
        </div>
      )}
    </div>
  );
}
