import { EmptyState } from "../../../components/common/EmptyState";
import { CourseGridSkeleton } from "../../../components/skeletons/CourseGridSkeleton";
import { PillSkeleton } from "../../../components/skeletons/PillSkeleton";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../auth/hooks/useAuth";
import { CourseGrid } from "../components/CourseGrid";
import { useCourses } from "../hooks/useCourses";
import { useMyCourses } from "../hooks/useMyCourses";

export function MyCoursesPage() {
  const { user } = useAuth();
  const role = user?.role ?? "student";
  const isStudent = role === "student";
  const myCourses = useMyCourses(isStudent);
  const roleCourses = useCourses(role, !isStudent);
  const courses = isStudent ? myCourses.courses : roleCourses.courses;
  const isLoading = isStudent ? myCourses.isLoading : roleCourses.isLoading;
  const error = isStudent ? myCourses.error : roleCourses.error;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
            My Courses
          </h1>
          <p className="mt-1 max-w-2xl text-[12px] text-ink-500">
            {role === "student" ?
              "Pick up exactly where you left off with enrolled courses only."
            : "Monitor active courses, progress, and what needs attention next."
            }
          </p>
        </div>
        {isLoading ? (
          <PillSkeleton />
        ) : (
          <Button variant="secondary" className="px-3 py-2 text-[12px]">
            {courses.length} active
          </Button>
        )}
      </div>
      {isLoading ?
        <CourseGridSkeleton count={3} columns="wide" />
      : error ?
        <p className="text-sm font-medium text-danger-700">{error}</p>
      : courses.length === 0 ?
        <EmptyState
          title="No enrolled courses yet"
          description="Once you join a course, it will show up here with progress and quick resume actions."
        />
      : <CourseGrid
          courses={courses}
          columns="wide"
          variant="enrolled"
        />
      }
    </section>
  );
}
