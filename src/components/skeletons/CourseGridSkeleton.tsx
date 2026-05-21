type CourseGridSkeletonColumns = "compact" | "default" | "wide";

const gridStyles: Record<CourseGridSkeletonColumns, string> = {
  compact: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
  default: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
  wide: "grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
};

export function CourseGridSkeleton({
  count = 3,
  columns = "default",
}: {
  count?: number;
  columns?: CourseGridSkeletonColumns;
}) {
  return (
    <div className={gridStyles[columns]}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-line-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.035)]"
        >
          <div className="h-[108px] animate-pulse bg-[linear-gradient(90deg,#f6f9ff_0%,#eef4ff_50%,#f6f9ff_100%)]" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-line-100" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-line-100" />
            <div className="h-3 w-full animate-pulse rounded bg-line-100" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-line-100" />
            <div className="flex items-center justify-between gap-3">
              <div className="h-3 w-16 animate-pulse rounded bg-line-100" />
              <div className="h-7 w-24 animate-pulse rounded-xl bg-line-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
