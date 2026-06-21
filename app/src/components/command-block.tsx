import { CommandLine } from "#/command-line";

interface CommandBlockProps {
  command: string;
  label: string;
  title?: string;
}

export function CommandBlock({ command, label, title = "bash" }: CommandBlockProps) {
  return (
    <div className="group relative rounded-xl border border-border dark:border-zinc-800/50 bg-card dark:bg-zinc-950 shadow-lg overflow-hidden transition-all hover:border-border/80 dark:hover:border-zinc-700/50 focus-within:border-border/80 dark:focus-within:border-zinc-700/50">
      <div className="flex items-center gap-1.5 border-b border-border dark:border-zinc-800/50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">{title}</span>
      </div>
      <div className="px-4 py-3.5 sm:px-5 sm:py-4">
        <CommandLine command={command} label={label} />
      </div>
    </div>
  );
}
