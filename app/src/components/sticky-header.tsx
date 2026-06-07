"use client";

import dynamic from "next/dynamic";
import { ThemeToggle } from "#/theme-toggle";
import { MobileNav } from "#/mobile-nav";
import type { SearchItemData } from "~/search-index";

const Search = dynamic(() => import("#/search").then((mod) => mod.Search), {
  loading: () => <div className="h-9 w-full max-w-sm animate-pulse rounded-md bg-muted" />,
});

export function StickyHeader({ searchItems, questions }: { searchItems: SearchItemData[]; questions: string[] }) {
  return (
    <header className="z-50 border-b bg-background">
      <div className="flex h-14 items-center gap-2 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8">
        <a href="/" className="font-medium shrink-0 text-accent">
          typescript-bits
        </a>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-4 text-sm shrink-0">
          <a href="/docs/introduction" className="hover:text-accent transition-colors">
            Docs
          </a>
          <a href="/contact" className="hover:text-accent transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex-1 flex justify-center min-w-0">
          <Search items={searchItems} questions={questions} />
        </div>

        {/* Desktop theme toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* Mobile nav trigger */}
        <MobileNav />
      </div>
    </header>
  );
}
