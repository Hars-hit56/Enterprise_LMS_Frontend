export function ContinueLearningSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-[14px] border border-line-100 px-3.5 py-3.5"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="h-[54px] w-[54px] shrink-0 animate-pulse rounded-2xl bg-line-100" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="h-3.5 w-44 max-w-full animate-pulse rounded bg-line-100" />
                  <div className="h-3 w-32 max-w-full animate-pulse rounded bg-line-100" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-line-100" />
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-1.5 flex-1 animate-pulse rounded-full bg-line-100" />
                <div className="h-3 w-8 animate-pulse rounded bg-line-100" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
