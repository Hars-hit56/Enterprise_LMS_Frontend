import { Clock3, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { Badge } from "../../../components/ui/Badge";
import type { Course } from "../../../types";

type CourseGridVariant = "dashboard" | "catalog" | "enrolled";
type CourseDetailSource =
  | "catalog"
  | "recommended"
  | "my-courses"
  | "dashboard";

interface CourseGridProps {
  courses: Course[];
  variant?: CourseGridVariant;
  columns?: "compact" | "default" | "wide";
  emptyTitle?: string;
  emptyDescription?: string;
}

interface CourseCardProps {
  course: Course;
  variant: CourseGridVariant;
}

const gridStyles = {
  compact: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
  default: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
  wide: "grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
};

function progressTone(progress: number) {
  if (progress >= 80) {
    return "bg-success-700";
  }

  return "bg-brand-500";
}

function getCourseDetailSource(
  course: Course,
  variant: CourseGridVariant,
): CourseDetailSource {
  if (variant === "enrolled") {
    return "my-courses";
  }

  if (variant === "dashboard") {
    return "dashboard";
  }

  return course.isRecommended ? "recommended" : "catalog";
}

function CourseCard({ course, variant }: CourseCardProps) {
  const showProgress = course.isEnrolled && variant !== "dashboard";
  const progressLabel = course.nextLesson ?? "In progress";
  const source = getCourseDetailSource(course, variant);

  return (
    <div className="overflow-hidden rounded-2xl border border-line-100 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
      <div className="grid min-h-[124px] place-items-center rounded-t-[15px] border-b border-line-100 bg-[linear-gradient(180deg,#e9eef6_0%,#dde5f0_100%)] px-4 py-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 text-[22px]">
          {course.thumbnail}
        </div>
      </div>

      <div className="flex h-full flex-col gap-2.5 rounded-b-[15px] bg-white px-5 py-5 transition hover:bg-soft">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge>{course.level}</Badge>
          <Badge tone="neutral">{course.category}</Badge>
        </div>

        <div className="space-y-0.5">
          <h3 className="text-[13px] font-medium leading-[18px] text-ink-950">
            {course.title}
          </h3>
          <p className="text-[11px] text-ink-500">{course.instructor}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {course.rating}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} />
            {course.students.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} />
            {course.duration}
          </span>
        </div>

        <div
          className={`mt-auto space-y-2 pt-0.5 ${showProgress ? "" : "opacity-0"}`}
        >
          <div className="flex items-center justify-between text-[10px] font-medium text-ink-500">
            <span>{progressLabel}</span>
            <span>{course.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-line-100">
            <div
              className={`h-1.5 rounded-full ${progressTone(course.progress)}`}
              style={{ width: `${showProgress ? course.progress : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseGrid({
  courses,
  variant = "catalog",
  columns = "default",
  emptyTitle = "No courses found",
  emptyDescription = "Try adjusting your filters or check back later for new content.",
}: CourseGridProps) {
  if (courses.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={gridStyles[columns]}>
      {courses.map((course) => (
        <div key={course.id} className="block">
          <CourseCard course={course} variant={variant} />
        </div>
      ))}
    </div>
  );
}

export function CourseGridSkeleton({
  count = 3,
  columns = "default",
}: {
  count?: number;
  columns?: CourseGridProps["columns"];
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
