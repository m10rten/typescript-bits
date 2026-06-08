"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = main;
      const maxScroll = scrollHeight - clientHeight;
      setProgress(maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0);
    };

    handleScroll();
    main.addEventListener("scroll", handleScroll, { passive: true });
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  const isComplete = progress >= 1;

  return (
    <div className="fixed top-14 left-0 right-0 h-0.5 z-40 pointer-events-none">
      <div
        className="h-full bg-accent transition-[width,opacity] duration-150 ease-out"
        style={{ width: `${progress * 100}%`, opacity: isComplete ? 0 : 1, transitionDuration: "150ms, 300ms" }}
      />
    </div>
  );
}
