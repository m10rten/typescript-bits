"use client";

import { type ReactNode } from "react";
import { CodeCopyButton } from "#/copy-button";

interface CodeBlockProps {
  html?: string;
  code: string;
  lang: string;
  headerActions?: ReactNode;
  children?: ReactNode;
}

export function CodeBlock({ html, code, lang, headerActions, children }: CodeBlockProps) {
  return (
    <div className="relative rounded-lg border bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800">
        <span className="text-xs text-zinc-400 font-mono">{lang}</span>
        <div className="flex items-center gap-2">
          {headerActions}
          <CodeCopyButton source={code} label={lang} />
        </div>
      </div>
      {children ?? (
        <div
          className="overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!p-4 [&_pre]:!m-0 [&_pre]:whitespace-pre"
          style={{ fontVariantLigatures: "none", fontFamily: "var(--font-geist-mono)" }}>
          <div dangerouslySetInnerHTML={{ __html: html! }} />
        </div>
      )}
    </div>
  );
}
