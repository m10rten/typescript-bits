"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "~/utils";
import { ThemeToggle } from "#/theme-toggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="md:hidden flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        onClick={() => setOpen((v) => !v)}>
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      {/* Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 w-64 z-50 bg-background border-l shadow-xl flex flex-col transition-transform duration-200 md:hidden",
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
          <Link
            href="/docs/introduction"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block rounded px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
        <div className="border-t px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
