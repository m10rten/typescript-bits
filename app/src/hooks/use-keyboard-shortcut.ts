"use client";

import { useEffect, useRef } from "react";

interface KeyboardShortcutOptions {
  metaKey?: boolean;
  ctrlKey?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut(key: string, handler: () => void, options?: KeyboardShortcutOptions) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const { metaKey: needMeta, ctrlKey: needCtrl, preventDefault = true } = options ?? {};

      const modSatisfied =
        (!needMeta && !needCtrl) ||
        (needMeta && e.metaKey) ||
        (needCtrl && e.ctrlKey) ||
        (needMeta && needCtrl && e.metaKey && e.ctrlKey);

      if (e.key === key && modSatisfied) {
        if (preventDefault) e.preventDefault();
        handlerRef.current();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, options?.metaKey, options?.ctrlKey, options?.preventDefault]);
}
