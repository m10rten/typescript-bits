import { CommandLine } from "#/command-line";

export function InstallHero() {
  const command = "npm install typescript-bits";

  return (
    <div className="group relative rounded-xl border border-zinc-800/50 bg-zinc-950 shadow-lg overflow-hidden transition-all hover:border-zinc-700/50 focus-within:border-zinc-700/50">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800/50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
        <span className="ml-2 text-xs text-zinc-500 font-mono">bash</span>
      </div>

      {/* Command area */}
      <div className="px-4 py-3.5 sm:px-5 sm:py-4">
        <CommandLine command={command} label="Copy" />
      </div>
    </div>
  );
}
