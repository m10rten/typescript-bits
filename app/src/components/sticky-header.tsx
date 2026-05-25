"use client";

import { useEffect, useState } from "react";

export function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ENTER = 80;
    const EXIT = 40;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > EXIT : y > ENTER));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div
        className={
          "flex h-14 items-center gap-6 px-4 sm:px-6 lg:px-8 transition-[height] duration-300 ease-out " +
          (scrolled ? "max-sm:h-12" : "")
        }>
        <a href="/" className="font-medium">
          typescript-bits
        </a>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm">
          <a href="/docs/introduction" className="hover:text-foreground transition-colors">
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
