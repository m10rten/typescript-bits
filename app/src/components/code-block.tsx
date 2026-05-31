"use client";

import { useState } from "react";
import { CodeCopyButton } from "#/copy-button";

export function CodeBlock({
  html,
  truncatedHtml,
  totalLines,
  source,
  displayName,
}: {
  html: string;
  truncatedHtml?: string;
  totalLines?: number;
  source: string;
  displayName: string;
}) {
  const [wrap, setWrap] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hasTruncation = truncatedHtml != null && totalLines != null && totalLines > 50;
  const displayHtml = hasTruncation && !expanded ? truncatedHtml : html;
  const truncatedCount = totalLines ? totalLines - 50 : 0;

  return (
    <div className="code-block relative rounded-lg border bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-400 font-mono">{displayName}.ts</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWrap((v) => !v)}
            aria-label={wrap ? "Switch to scroll mode" : "Switch to wrap mode"}
            className="hidden sm:inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            {wrap ? "Wrap" : "Scroll"}
          </button>
          <CodeCopyButton source={source} label={displayName} />
        </div>
      </div>
      <div className="relative">
        <div
          tabIndex={0}
          className={
            "pl-0 sm:pl-1 md:pl-2 xl:pl-3 text-sm leading-relaxed focus:outline-ring " +
            "[&_pre]:!bg-transparent [&_pre]:!p-0 " +
            (wrap ? "overflow-x-hidden [&_pre]:!whitespace-pre-wrap " : "overflow-x-auto ") +
            "max-sm:!overflow-x-hidden max-sm:[&_pre]:!whitespace-pre-wrap" +
            (hasTruncation && !expanded ? " pb-24" : "")
          }
          style={{
            fontVariantLigatures: "none",
            fontFamily: "var(--font-geist-mono)",
          }}
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
        {hasTruncation && !expanded && (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/90 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              Show all {truncatedCount} more lines ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
