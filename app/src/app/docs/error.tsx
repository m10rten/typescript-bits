"use client";

import Link from "next/link";
import { Button } from "#/ui/button";

export default function DocsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0 0 0 / 0.03) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      {/* Subtle glow */}
      <div className="absolute size-96 rounded-full bg-primary/5 blur-[120px] -z-10" aria-hidden="true" />

      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-foreground/10 select-none">500</h1>

        <div className="space-y-2">
          <p className="text-xl font-medium">
            Documentation crashed with <code className="text-destructive">unhandled rejection</code>
          </p>
          <p className="text-sm text-muted-foreground">
            {error.digest
              ? `Error digest: ${error.digest}. Not found in any examples directory.`
              : "This module failed to export. Check the stack trace."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={reset} type="button">
            Try Again
          </Button>
          <Button nativeButton={false} render={<Link href="/docs" />} variant="outline">
            Docs Home
          </Button>
        </div>
      </div>
    </div>
  );
}
