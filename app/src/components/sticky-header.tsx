"use client";

import dynamic from "next/dynamic";
import { ThemeToggle } from "#/theme-toggle";
import { MobileNav } from "#/mobile-nav";
import { Popover, PopoverContent, PopoverTrigger } from "#/ui/popover";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import type { SearchItemData } from "~/search-index";

const Search = dynamic(() => import("#/search").then((mod) => mod.Search), {
  loading: () => <div className="h-9 w-full max-w-sm animate-pulse rounded-md bg-muted" />,
});

export function StickyHeader({ searchItems, questions }: { searchItems: SearchItemData[]; questions: string[] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-14 items-center gap-2 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="group flex items-center gap-2.5 shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
          <span className="flex size-6 items-center justify-center rounded-[7px] bg-accent text-accent-foreground shrink-0">
            <svg viewBox="0 0 32 32" className="size-3.5" aria-hidden="true">
              <path
                d="M16 4 C17 12,20 15,28 16 C20 17,17 20,16 28 C15 20,12 17,4 16 C12 15,15 12,16 4 Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="font-mono font-medium tracking-tight text-foreground">
            typescript<span className="text-accent">-bits</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-4 text-sm shrink-0">
          <Popover>
            <PopoverTrigger className="flex items-center gap-1 hover:text-accent transition-colors cursor-pointer outline-none focus-visible:outline-none">
              Docs <ChevronDown className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-40 p-1.5">
              <PopoverPrimitive.Close
                render={<a href="/docs/modules" />}
                nativeButton={false}
                className="block rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                Modules
              </PopoverPrimitive.Close>
              <PopoverPrimitive.Close
                render={<a href="/docs/skills" />}
                nativeButton={false}
                className="block rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                Skills
              </PopoverPrimitive.Close>
            </PopoverContent>
          </Popover>
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
