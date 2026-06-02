export function RecommendationCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-[18px] border border-line-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.035)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-line-100" />
            <div className="h-7 w-24 animate-pulse rounded-full bg-line-100" />
          </div>

          <div className="mt-5 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-line-100" />
            <div className="h-3 w-full animate-pulse rounded bg-line-100" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-line-100" />
          </div>

          <div className="mt-4 rounded-xl border border-line-100 bg-soft p-3">
            <div className="h-3 w-24 animate-pulse rounded bg-line-100" />
            <div className="mt-2 h-3 w-full animate-pulse rounded bg-line-100" />
            <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-line-100" />
          </div>

          <div className="mt-4 flex gap-2">
            <div className="h-7 w-20 animate-pulse rounded-full bg-line-100" />
            <div className="h-7 w-28 animate-pulse rounded-full bg-line-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
