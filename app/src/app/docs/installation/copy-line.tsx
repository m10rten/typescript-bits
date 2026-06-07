"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "~/utils";

export function CopyLine({ code, highlighted }: { code: string; highlighted: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group flex items-center gap-2 rounded-lg border bg-zinc-950 px-4 py-3 overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!text-sm">
      <div
        className="flex-1 min-w-0"
        style={{ fontVariantLigatures: "none", fontFamily: "var(--font-geist-mono)" }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      <button
        type="button"
        aria-label="Copy code"
        className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={() => {
          copyToClipboard(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}>
        {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
