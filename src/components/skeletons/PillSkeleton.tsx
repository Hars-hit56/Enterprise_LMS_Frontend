export function PillSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`h-9 w-20 animate-pulse rounded-lg bg-line-100 ${className}`} />
  );
}
