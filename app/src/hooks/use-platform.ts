"use client";

import { useState, useEffect } from "react";

export function usePlatform() {
  const [isMac, setIsMac] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMac(navigator.platform.startsWith("Mac"));
  }, []);

  return { isMac, modifierKey: (isMac ? "⌘" : "Ctrl") as string } as const;
}
