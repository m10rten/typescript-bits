"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "~/utils";

type View = "package" | "source-local" | "source-copy";

const VIEW_LABELS: Record<View, string> = {
  package: "Install Package",
  "source-local": "Install Source",
  "source-copy": "Copy Source",
};

const VIEWS: View[] = ["package", "source-local", "source-copy"];

const VIEW_INDEX: Record<View, number> = {
  package: 0,
  "source-local": 1,
  "source-copy": 2,
};

const STORAGE_KEY = "docs-view";

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current: View = (searchParams.get("view") as View) ?? "package";
  const synced = useRef(false);

  // On mount, sync saved preference from localStorage to URL
  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    const saved = localStorage.getItem(STORAGE_KEY) as View | null;
    if (saved && saved !== current) {
      const params = new URLSearchParams(searchParams.toString());
      if (saved === "package") {
        params.delete("view");
      } else {
        params.set("view", saved);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    } else if (!saved) {
      localStorage.setItem(STORAGE_KEY, current);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function setView(view: View) {
    localStorage.setItem(STORAGE_KEY, view);
    const params = new URLSearchParams(searchParams.toString());
    if (view === "package") {
      params.delete("view");
    } else {
      params.set("view", view);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const segmentW = 100 / VIEWS.length;

  return (
    <div className="relative flex rounded-full border border-border p-0.5" role="group" aria-label="View mode">
      {/* Sliding indicator */}
      <div
        className="absolute inset-y-0.5 rounded-full bg-primary transition-transform duration-200 ease-out"
        style={{
          width: `${segmentW}%`,
          transform: `translateX(${VIEW_INDEX[current] * 100}%)`,
        }}
      />
      {VIEWS.map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={current === v}
          className={cn(
            "relative z-10 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
            current === v ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setView(v)}>
          {VIEW_LABELS[v]}
        </button>
      ))}
    </div>
  );
}
