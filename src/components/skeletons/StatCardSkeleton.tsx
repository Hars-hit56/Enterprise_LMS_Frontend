import { Card } from "../ui/Card";

function StatCardSkeleton() {
  return (
    <Card className="flex min-h-[88px] items-start justify-between gap-3 p-3">
      <div className="w-full max-w-[180px] space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-line-100" />
        <div className="h-5 w-20 animate-pulse rounded bg-line-100" />
        <div className="h-3 w-28 animate-pulse rounded bg-line-100" />
      </div>
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-line-100" />
    </Card>
  );
}

export function StatCardSkeletonGrid({
  count = 3,
  columns = 3,
}: {
  count?: number;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={`grid gap-4 ${columns === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}
