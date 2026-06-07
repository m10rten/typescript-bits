import { Skeleton } from "#/ui/skeleton";

export default function InstallationLoading() {
  return (
    <div className="flex flex-col container-main py-8 gap-6" role="status">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-10" />
        <span className="text-muted-foreground text-sm">/</span>
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Content blocks */}
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-10 w-full max-w-xs rounded-md" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-10 w-full max-w-xs rounded-md" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>

      <span className="sr-only">Loading installation page…</span>
    </div>
  );
}
