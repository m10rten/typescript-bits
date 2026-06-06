"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "~/utils";

export function CodeCopyButton({ source, label }: { source: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label={`Copy ${label} source code`}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      onClick={() => {
        copyToClipboard(source).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}>
      <Copy className="size-3.5" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
