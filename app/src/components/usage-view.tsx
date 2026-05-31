export interface UsageViewProps {
  /** Pre-highlighted HTML of the import statement (omit to hide import block) */
  importHtml?: string;
  /** Pre-highlighted HTML of the concatenated usage examples (may be empty) */
  examplesHtml?: string;
}

export function UsageView({ importHtml, examplesHtml }: UsageViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Import statement — hidden for Copy Source view */}
      {importHtml && (
        <div className="rounded-lg border bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <span className="text-xs text-zinc-400 font-mono">import</span>
          </div>
          <div className="px-4 py-3 overflow-x-auto">
            <div
              className="[&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!text-sm"
              style={{ fontVariantLigatures: "none", fontFamily: "var(--font-geist-mono)" }}
              dangerouslySetInnerHTML={{ __html: importHtml }}
            />
          </div>
        </div>
      )}

      {/* Combined usage examples */}
      {examplesHtml && (
        <div className="rounded-lg border bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            <span className="text-xs text-zinc-400 font-mono">examples</span>
          </div>
          <div
            className={
              "usage-examples " +
              "px-0 sm:px-1 md:px-2 xl:px-3 py-3 overflow-x-auto " +
              "[&_pre]:!bg-transparent [&_pre]:!p-0 " +
              "[&_pre]:!m-0 text-sm leading-relaxed"
            }
            style={{
              fontVariantLigatures: "none",
              fontFamily: "var(--font-geist-mono)",
            }}
            dangerouslySetInnerHTML={{ __html: examplesHtml }}
          />
        </div>
      )}
    </div>
  );
}
