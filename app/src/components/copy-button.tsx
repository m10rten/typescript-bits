"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "$/use-copy-to-clipboard";

export function CodeCopyButton({ source, label }: { source: string; label: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      aria-label={`Copy ${label} source code`}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      onClick={() => copy(source)}>
      {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
      <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
