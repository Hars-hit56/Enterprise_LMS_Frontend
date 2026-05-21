export function CourseDetailSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-40 animate-pulse rounded-[28px] bg-line-100" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-2xl bg-line-100" />
          <div className="h-80 animate-pulse rounded-2xl bg-line-100" />
        </div>
        <div className="h-56 animate-pulse rounded-2xl bg-line-100" />
      </div>
    </section>
  );
}

export function CoursePlayerSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-40 animate-pulse rounded-[28px] bg-line-100" />
      <div className="h-80 animate-pulse rounded-2xl bg-line-100" />
    </section>
  );
}
