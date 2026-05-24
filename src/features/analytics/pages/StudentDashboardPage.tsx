import {
  ArrowRight,
  BookOpen,
  Play,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../../../components/common/StatCard";
import { ContinueLearningSkeleton } from "../../../components/skeletons/ContinueLearningSkeleton";
import { CourseGridSkeleton } from "../../../components/skeletons/CourseGridSkeleton";
import { StatCardSkeletonGrid } from "../../../components/skeletons/StatCardSkeleton";
import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCourses } from "../../courses/hooks/useCourses";
import { useMyCourses } from "../../courses/hooks/useMyCourses";
import { DashboardSection } from "../components/DashboardSection";
import { useStudentAnalytics } from "../hooks/useAnalytics";

const fallbackIcons = [Sparkles, BookOpen, TrendingUp];

export function StudentDashboardPage() {
  const {
    stats,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useStudentAnalytics();
  const { courses, isLoading: isCatalogLoading } = useCourses("student");
  const {
    courses: enrolledCourses,
    isLoading: isMyCoursesLoading,
    error: myCoursesError,
  } = useMyCourses();
  const { user } = useAuth();
  const recommendedCourses = courses.filter(
    (course) => !course.isEnrolled && course.isRecommended,
  );

  function isImageUrl(value: string | undefined) {
    return Boolean(value && /^https?:\/\//i.test(value));
  }
  return (
    <DashboardSection
      title={`Welcome back, ${user?.name.split(" ")[0] ?? "Learner"}`}
      description="A quick overview of your learning flow, progress, and personalized recommendations."
    >
      {analyticsError ? (
        <p className="text-sm font-medium text-danger-700">{analyticsError}</p>
      ) : null}
      {isAnalyticsLoading ? (
        <StatCardSkeletonGrid />
      ) : (
        <div className="grid gap-2.5 xl:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon ?? fallbackIcons[index];
            return (
              <StatCard key={stat.id} stat={stat} icon={<Icon size={16} />} />
            );
          })}
        </div>
      )}

      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-medium text-ink-950">
            Continue Learning
          </h2>
          <Link
            to="/student/my-courses"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500 transition hover:text-ink-950"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {myCoursesError ? (
          <p className="text-sm font-medium text-danger-700">
            {myCoursesError}
          </p>
        ) : isMyCoursesLoading ? (
          <ContinueLearningSkeleton count={3} />
        ) : (
          <div className="space-y-3">
            {enrolledCourses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                to={`/student/courses/${course.id}?source=my-courses`}
                className={`block rounded-[14px] border border-line-100 px-3.5 py-3.5 
                 hover:bg-soft transition-colors duration-200 
                `}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="grid h-[54px] w-[54px] shrink-0 overflow-hidden place-items-center rounded-2xl bg-line-100 text-[25px] text-ink-900">
                    {isImageUrl(course?.thumbnail) ? (
                      <img
                        src={course?.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      course?.thumbnail
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-[13px] font-medium text-ink-950">
                          {course.title}
                        </h3>
                        <p className="mt-0.5 text-[12px] text-ink-500">
                          {course.nextLesson}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 self-start text-[12px] font-medium text-ink-950 transition hover:text-brand-600">
                        <Play size={13} />
                        Resume
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2.5">
                      <div className="h-1.5 flex-1 rounded-full bg-line-100">
                        <div
                          className="h-1.5 rounded-full bg-brand-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-medium text-ink-500">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-brand-600">
          <Sparkles size={16} />
          <h2 className="text-[14px] font-medium text-ink-950">
            Recommended for You
          </h2>
        </div>

        {isCatalogLoading ? (
          <CourseGridSkeleton count={3} columns="default" />
        ) : (
          <div className="grid gap-3 xl:grid-cols-3">
            {recommendedCourses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                to={`/student/courses/${course.id}?source=recommended`}
                className="rounded-[22px] border border-line-100 bg-white px-4 py-4 transition hover:border-brand-200 hover:shadow-[0_16px_32px_rgba(15,23,42,0.06)]"
              >
                <div className="grid h-10 w-10 place-items-center text-[24px]">
                  {course.thumbnail}
                </div>
                <h3 className="mt-5 text-[13px] font-medium leading-5 text-ink-950">
                  {course.title}
                </h3>
                <p className="mt-1.5 text-[12px] text-ink-500">
                  {course.instructor}
                </p>

                <div className="mt-4 flex items-center gap-2.5 text-[12px] text-ink-500">
                  <span className="inline-flex items-center gap-1.5 text-ink-950">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {course.rating}
                  </span>
                  <span>&middot;</span>
                  <span>{course.duration}</span>
                </div>

                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-line-100 px-3.5 py-1.5 text-[11px] font-medium text-ink-900">
                    {course.level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </DashboardSection>
  );
}
