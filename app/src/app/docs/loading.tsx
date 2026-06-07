export default function Loading() {
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

      <div className="flex flex-col items-center gap-4" role="status">
        <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}
