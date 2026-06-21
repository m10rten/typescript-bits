"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "~/utils";
import { ThemeToggle } from "#/theme-toggle";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "#/ui/collapsible";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Toggle button — stays in header DOM, not portalled */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="md:hidden flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        onClick={() => setOpen((v) => !v)}>
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {/* Backdrop and panel are portalled to document.body so they escape the
          header's stacking context and always render above all other fixed layers */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop — z-[55] covers the sidebar button at z-50 */}
            {open && (
              <div
                className="fixed inset-0 z-[55] bg-black/40 md:hidden"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Panel */}
            <aside
              className={cn(
                "fixed inset-y-0 right-0 w-64 z-[60] bg-background border-l shadow-xl flex flex-col transition-transform duration-200 md:hidden",
                open ? "translate-x-0" : "translate-x-full",
              )}>
              <div className="flex items-center justify-between px-4 h-14 border-b">
                <span className="font-medium text-sm">Menu</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1" aria-label="Mobile navigation">
                <Collapsible open={docsOpen} onOpenChange={setDocsOpen}>
                  <CollapsibleTrigger className="w-full flex items-center justify-between rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors">
                    Docs
                    <ChevronDown
                      className={cn("size-4 transition-transform duration-200", docsOpen && "rotate-180")}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    className="overflow-hidden transition-[height] duration-200 ease-in-out ml-3 mt-1 space-y-0.5 border-l-2 border-purple-500/20 pl-3"
                    style={{ height: "var(--collapsible-panel-height, 0)" }}>
                    <Link
                      href="/docs/modules"
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1">
                      Modules
                    </Link>
                    <Link
                      href="/docs/skills"
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1">
                      Skills
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
              <div className="border-t px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </aside>
          </>,
          document.body,
        )}
    </>
  );
}
