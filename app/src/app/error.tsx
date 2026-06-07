"use client";

import { Button } from "#/ui/button";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="relative flex flex-1 min-h-full items-center justify-center overflow-hidden">
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
      <div className="absolute size-96 rounded-full bg-destructive/5 blur-[120px] -z-10" aria-hidden="true" />

      <div className="flex flex-1 flex-col items-center gap-6 px-4 text-center">
        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-foreground/10 select-none">500</h1>

        <div className="space-y-2">
          <p className="text-xl font-medium">
            Uncaught exception at <code className="text-destructive">root scope</code>
          </p>
          <p className="text-sm text-muted-foreground">
            {error.digest
              ? `Error digest: ${error.digest}. The runtime env is not what it seems.`
              : "No amount of try-catch nesting can fix this one."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={reset} type="button">
            Try Again
          </Button>
          <Button nativeButton={false} render={<a href="/" />} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
