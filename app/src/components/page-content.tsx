"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { UsageView } from "#/usage-view";
import { OverflowCodeBlock } from "#/overflow-code-block";
import { InstallDropdown } from "#/install-dropdown";

interface PageContentProps {
  /** Pre-highlighted source HTML for "Copy Source" view (using clean source) */
  sourceHtml: string;
  /** Pre-highlighted truncated source HTML, for collapsed "Copy Source" view */
  sourceTruncatedHtml?: string;
  /** Total number of lines in the source (used to show remaining count) */
  sourceTotalLines?: number;
  /** Number of lines hidden in truncated view (for expand button text) */
  sourceHiddenLines?: number;
  /** Clean raw source code (without @example blocks) */
  sourceCode: string;
  /** Display name shown in source block header (also used as module name for CLI commands) */
  sourceName: string;
  /** Pre-highlighted import HTML for "Install Package" view (from "typescript-bits") */
  importHtml: string;
  /** Pre-highlighted import HTML for "Install Source" view (from "../lib/bits/...") */
  importLocalHtml: string;
  /** Pre-highlighted HTML of concatenated usage examples */
  examplesHtml: string;
  /** Pre-highlighted HTML of concatenated usage examples with local import paths (for Copy Source) */
  examplesLocalHtml?: string;
  /** Optional children rendered in "Install Package" view before examples (e.g. submodule cards) */
  children?: ReactNode;
}

export function PageContent({
  sourceHtml,
  sourceTruncatedHtml,
  sourceTotalLines,
  sourceHiddenLines,
  sourceCode,
  sourceName,
  importHtml,
  importLocalHtml,
  examplesHtml,
  examplesLocalHtml,
  children,
}: PageContentProps) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "package";

  return (
    <>
      {/* "Install Package" — package manager install + submodule cards + usage */}
      {view === "package" && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold tracking-tight">Installation</h2>
          <InstallDropdown module={sourceName} mode="install" />
          {children}
          <UsageView importHtml={importHtml} examplesHtml={examplesHtml} />
        </div>
      )}

      {/* "Install Source" — CLI source copy + usage */}
      {view === "source-local" && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold tracking-tight">Installation</h2>
          <InstallDropdown module={sourceName} mode="cli" />
          <UsageView importHtml={importLocalHtml} examplesHtml={examplesHtml} />
        </div>
      )}

      {/* "Copy Source" — usage (above) + source code */}
      {view === "source-copy" && (
        <div className="flex flex-col gap-6">
          <UsageView examplesHtml={examplesLocalHtml ?? examplesHtml} />
          <h2 className="text-xl font-semibold tracking-tight">Source</h2>
          <OverflowCodeBlock
            html={sourceHtml}
            truncatedHtml={sourceTruncatedHtml}
            totalLines={sourceTotalLines}
            hiddenLines={sourceHiddenLines}
            source={sourceCode}
            displayName={sourceName}
          />
        </div>
      )}
    </>
  );
}
