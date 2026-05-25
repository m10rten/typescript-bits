import Link from "next/link";
import { Button } from "#/ui/button";

export default function NotFound() {
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
        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-foreground/10 select-none">404</h1>

        <div className="space-y-2">
          <p className="text-xl font-medium">
            This page returned <code className="text-destructive">undefined</code>
          </p>
          <p className="text-sm text-muted-foreground">No type assertion in the world can save it now.</p>
        </div>

        <Button nativeButton={false} render={<Link href="/" />}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
