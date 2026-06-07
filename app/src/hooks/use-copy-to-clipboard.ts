"use client";

import { useState, useCallback } from "react";
import { copyToClipboard } from "~/utils";

export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    },
    [resetDelay],
  );

  return { copied, copy } as const;
}
