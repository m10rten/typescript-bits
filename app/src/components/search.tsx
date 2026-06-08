"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { usePlatform } from "$/use-platform";
import { useKeyboardShortcut } from "$/use-keyboard-shortcut";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent } from "#/ui/dialog";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "#/ui/command";
import { Spinner } from "#/ui/spinner";
import type { SearchItemData } from "~/search-index";

interface SearchProps {
  items: SearchItemData[];
  questions: string[];
}

export function Search({ items, questions }: SearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search docs...");
  const { isMac } = usePlatform();

  // Pick a random placeholder on mount
  useEffect(() => {
    if (questions.length > 0) {
      setPlaceholder(questions[Math.floor(Math.random() * questions.length)]!);
    }
  }, [questions]);

  useKeyboardShortcut("k", () => setOpen((prev) => !prev), { metaKey: true, ctrlKey: true });

  // Brief loading animation when dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      setQuery("");
      const timer = setTimeout(() => setLoading(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSelect = useCallback(
    (item: SearchItemData) => {
      setOpen(false);
      router.push(item.url);
    },
    [router],
  );

  // Filter results with simple scoring
  const results = useCallback(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const scored = items
      .map((item) => {
        const title = item.title.toLowerCase();
        const desc = item.description.toLowerCase();
        const content = item.content?.toLowerCase() ?? "";
        let score = 0;

        if (title === q) score = 10;
        else if (title.startsWith(q)) score = 8;
        else if (title.includes(q)) score = 5;
        else if (q.split(/\s+/).some((w) => title.includes(w))) score = 3;
        else if (desc.includes(q)) score = 2;
        else if (content.includes(q)) score = 1;

        // Also boost score when query words appear in content
        if (score > 0 && score < 5) {
          const words = q.split(/\s+/).filter((w) => w.length > 2);
          const contentMatches = words.filter((w) => content.includes(w)).length;
          if (contentMatches >= 2) score += 1;
        }

        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    // Group by category, preserving order
    const groups: Record<string, SearchItemData[]> = {};
    const order = ["Module", "Submodule", "Export", "Skill", "Page"] as const;

    for (const { item } of scored) {
      (groups[item.category] ??= []).push(item);
    }

    return order.filter((cat) => groups[cat]).map((label) => ({ label, items: groups[label]! }));
  }, [query, items]);

  const grouped = results();

  return (
    <>
      {/* ── Trigger bar ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 h-8 w-full max-w-xs rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-ring/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <SearchIcon className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
        <span className="truncate">{placeholder}</span>
        {isMac !== null && (
          <span className="ml-auto hidden sm:flex items-center gap-0.5 text-[10px] text-muted-foreground/50">
            <kbd className="inline-flex items-center justify-center rounded border border-border/50 px-1 font-sans leading-none py-0.5">
              {isMac ? "⌘" : "Ctrl"}
            </kbd>
            <kbd className="inline-flex items-center justify-center rounded border border-border/50 px-1 font-sans leading-none py-0.5">
              K
            </kbd>
          </span>
        )}
      </button>

      {/* ── Search dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="top-[15%] sm:top-[20%] translate-y-0 sm:min-w-xl md:min-w-2xl p-0 overflow-hidden rounded-xl"
          showCloseButton={false}>
          <Command shouldFilter={false} className="p-0!">
            {/* Search input row */}
            <div className="flex items-center gap-2.5 border-b px-3.5">
              <SearchIcon className="size-4 shrink-0 text-muted-foreground/60" />
              <CommandPrimitive.Input
                placeholder={placeholder}
                value={query}
                onValueChange={setQuery}
                autoFocus
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
            </div>

            <CommandList>
              {/* Loading state */}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground animate-in fade-in duration-200">
                  <Spinner />
                  <span>Loading index&hellip;</span>
                </div>
              )}

              {/* Empty state — only after loading is done and query has no results */}
              {!loading && query.trim() && grouped.length === 0 && (
                <CommandEmpty className="py-16 animate-in fade-in duration-200">
                  <p className="text-sm text-muted-foreground">No results found for &ldquo;{query}&rdquo;</p>
                </CommandEmpty>
              )}

              {/* Results */}
              {!loading &&
                grouped.map((group) => (
                  <CommandGroup key={group.label} heading={group.label}>
                    {group.items.map((item, i) => (
                      <CommandItem
                        key={item.id}
                        value={item.title}
                        onSelect={() => handleSelect(item)}
                        className="animate-in fade-in slide-in-from-bottom-1 duration-200"
                        style={{ animationDelay: `${i * 35}ms`, animationFillMode: "both" }}>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground leading-tight">{item.description}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}

              {/* Idle state */}
              {!loading && !query.trim() && (
                <div className="py-16 text-center text-sm text-muted-foreground animate-in fade-in duration-300">
                  Type to search documentation&hellip;
                </div>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
