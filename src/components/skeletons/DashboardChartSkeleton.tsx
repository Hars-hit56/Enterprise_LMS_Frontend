import { Card } from "../ui/Card";

export function DashboardChartSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-5 w-5 animate-pulse rounded bg-line-100" />
        <div className="h-4 w-32 animate-pulse rounded bg-line-100" />
      </div>
      <div className="flex h-[250px] w-full items-end gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-1 items-end justify-center gap-1"
          >
            <div
              className="w-full animate-pulse rounded-t bg-line-100"
              style={{ height: `${72 + ((index * 29) % 120)}px` }}
            />
            <div
              className="w-full animate-pulse rounded-t bg-line-100"
              style={{ height: `${42 + ((index * 17) % 80)}px` }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
