"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "#/ui/button";
import { useMounted } from "$/use-mounted";

export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    // Prevent layout shift — same size as the button
    return <div className="size-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-10"
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}>
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
