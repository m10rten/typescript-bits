import { cn } from "~/utils";
import { CodeCopyButton } from "#/copy-button";

interface CommandLineProps {
  command: string;
  label: string;
  prefix?: string;
  className?: string;
}

export function CommandLine({ command, label, prefix = "$", className }: CommandLineProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {prefix && (
        <span className="shrink-0 font-mono text-sm text-zinc-500 select-none" aria-hidden="true">
          {prefix}
        </span>
      )}
      <code
        className="flex-1 min-w-0 font-mono text-sm text-zinc-100 select-all truncate"
        style={{ fontVariantLigatures: "none" }}>
        {command}
      </code>
      <CodeCopyButton source={command} label={label} />
    </div>
  );
}
