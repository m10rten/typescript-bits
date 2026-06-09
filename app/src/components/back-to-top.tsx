"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SCROLL_THRESHOLD = 300;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    const handleScroll = () => {
      setVisible(main.scrollTop > SCROLL_THRESHOLD);
    };

    handleScroll();
    main.addEventListener("scroll", handleScroll, { passive: true });
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    document.getElementById("main-content")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="flex items-center justify-center sm:justify-end sm:self-end
        rounded-full border border-border bg-background px-3 py-1.5
        text-xs font-medium text-muted-foreground
        shadow-xs cursor-pointer
        hover:text-foreground
        focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50
        gap-1.5">
      <ArrowUp className="size-3" />
      <span>Back to top</span>
    </button>
  );
}
