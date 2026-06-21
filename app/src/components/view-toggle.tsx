"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils";
import { useLocalStorage } from "$/use-local-storage";

type View = "package" | "source-local" | "source-copy" | "ask-ai";

const VIEW_LABELS: Record<View, string> = {
  package: "Install Package",
  "source-local": "Install Source",
  "source-copy": "Copy Source",
  "ask-ai": "Ask AI",
};

const VIEWS: View[] = ["package", "source-local", "source-copy", "ask-ai"];

const VIEW_INDEX: Record<View, number> = {
  package: 0,
  "source-local": 1,
  "source-copy": 2,
  "ask-ai": 3,
};

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current: View = (searchParams.get("view") as View) ?? "package";
  const synced = useRef(false);
  const [savedView, setSavedView] = useLocalStorage<View | null>("docs-view", null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // On mount, sync saved preference from localStorage to URL
  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    if (savedView && savedView !== current) {
      const params = new URLSearchParams(searchParams.toString());
      if (savedView === "package") {
        params.delete("view");
      } else {
        params.set("view", savedView);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    } else if (!savedView) {
      setSavedView(current);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function setView(view: View) {
    setSavedView(view);
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

  return isMobile ? (
    <select
      value={current}
      onChange={(e) => setView(e.target.value as View)}
      className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
      {VIEWS.map((v) => (
        <option key={v} value={v}>
          {VIEW_LABELS[v]}
        </option>
      ))}
    </select>
  ) : (
    <div className="relative flex rounded-full border border-border p-0.5" role="group" aria-label="View mode">
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
            "relative z-10 flex-1 inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-medium transition-colors",
            current === v ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setView(v)}>
          {VIEW_LABELS[v]}
        </button>
      ))}
    </div>
  );
}
