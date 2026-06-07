import { Skeleton } from "#/ui/skeleton";

export default function SubmoduleLoading() {
  return (
    <div className="flex flex-col container-main py-8 gap-6" role="status">
      {/* Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <span className="text-muted-foreground text-sm">/</span>
          <Skeleton className="h-4 w-16" />
          <span className="text-muted-foreground text-sm">/</span>
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="size-8 rounded-md" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-36 rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-3 pt-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-5 w-28 mt-4" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      <span className="sr-only">Loading submodule…</span>
    </div>
  );
}
