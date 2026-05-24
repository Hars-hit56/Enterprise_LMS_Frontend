import { Card } from "../ui/Card";

export function DataTableSkeleton({
  columns = 5,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-line-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-line-100" />
          <div className="h-3 w-16 animate-pulse rounded bg-line-100" />
        </div>
        <div className="h-9 w-56 animate-pulse rounded-lg bg-line-100" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-soft">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-5 py-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-line-100" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-line-100">
                {Array.from({ length: columns }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-3.5">
                    <div
                      className={`h-3 animate-pulse rounded bg-line-100 ${
                        cellIndex === 0
                          ? "w-40"
                          : cellIndex === columns - 1
                            ? "w-8"
                            : "w-24"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
