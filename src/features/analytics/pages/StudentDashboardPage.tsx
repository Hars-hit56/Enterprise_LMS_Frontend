import {
  ArrowRight,
  BookOpen,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../../../components/common/StatCard";
import { ContinueLearningSkeleton } from "../../../components/skeletons/ContinueLearningSkeleton";
import { RecommendationCardSkeleton } from "../../../components/skeletons/RecommendationCardSkeleton";
import { StatCardSkeletonGrid } from "../../../components/skeletons/StatCardSkeleton";
import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMyCourses } from "../../courses/hooks/useMyCourses";
import { DashboardSection } from "../components/DashboardSection";
import {
  useStudentAnalytics,
  useStudentRecommendations,
} from "../hooks/useAnalytics";

const fallbackIcons = [Sparkles, BookOpen, TrendingUp];

function isImageUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function getCourseInitial(title: string | undefined) {
  return title?.charAt(0).toUpperCase() || "C";
}

function getLessonCount(
  modules:
    | {
        lectures?: unknown[];
        lessons?: unknown[];
      }[]
    | undefined,
) {
  return (
    modules?.reduce(
      (total, module) =>
        total + (module.lectures?.length ?? module.lessons?.length ?? 0),
      0,
    ) ?? 0
  );
}

function formatCoursePrice(
  price: string | number | null | undefined,
  currency: string | undefined,
  isFree: boolean | undefined,
) {
  if (isFree || price === null || price === undefined || price === "") {
    return "Free";
  }

  const numericPrice = Number(price);

  if (Number.isFinite(numericPrice)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency ?? "INR",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  return `${currency ?? "INR"} ${price}`;
}

export function StudentDashboardPage() {
  const {
    stats,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useStudentAnalytics();
  const {
    recommendedCourses,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
  } = useStudentRecommendations();
  const {
    courses: enrolledCourses,
    isLoading: isMyCoursesLoading,
    error: myCoursesError,
  } = useMyCourses();
  const { user } = useAuth();

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

      {isMyCoursesLoading || myCoursesError || enrolledCourses.length ? (
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
      ) : null}

      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-brand-600">
          <Sparkles size={16} />
          <h2 className="text-[14px] font-medium text-ink-950">
            Recommended for You
          </h2>
        </div>

        {recommendationsError ? (
          <p className="text-sm font-medium text-danger-700">
            {recommendationsError}
          </p>
        ) : isRecommendationsLoading ? (
          <RecommendationCardSkeleton count={3} />
        ) : recommendedCourses.length ? (
          <div className="grid gap-3 xl:grid-cols-3">
            {recommendedCourses.slice(0, 3).map((recommendation) => {
              const course = recommendation.course;
              const courseId = course._id ?? course.id ?? "";
              const lessonCount = getLessonCount(course.modules);
              const thumbnail = course.thumbnail ?? getCourseInitial(course.title);

              return (
                <Link
                  key={courseId}
                  to={`/student/courses/${courseId}?source=recommended`}
                  className="group rounded-[18px] border border-line-100 bg-white p-4 transition hover:border-brand-200 hover:shadow-[0_16px_32px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-11 w-11 shrink-0 overflow-hidden place-items-center rounded-xl bg-line-100 text-[24px] font-semibold text-ink-900">
                      {isImageUrl(course.thumbnail) ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        thumbnail
                      )}
                    </div>

                    <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                      {recommendation.score} match
                    </span>
                  </div>

                  <h3 className="mt-5 text-[13px] font-medium leading-5 text-ink-950">
                    {course.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 min-h-9 text-[12px] leading-[18px] text-ink-500">
                    {course.description}
                  </p>

                  <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-700">
                      <Sparkles size={12} />
                      Why this course
                    </div>
                    <p className="mt-1.5 line-clamp-2 min-h-9 text-[12px] leading-[18px] text-ink-700">
                      {recommendation.reason}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5 text-[12px] text-ink-500">
                    <span>{lessonCount} lessons</span>
                    <span>&middot;</span>
                    <span>
                      {formatCoursePrice(
                        course.price,
                        course.currency,
                        course.isFree,
                      )}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-line-100 px-3.5 py-1.5 text-[11px] font-medium text-ink-900">
                      {course.level}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] font-medium text-brand-700">
                      {course.category}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[14px] border border-line-100 px-4 py-6 text-center text-sm text-ink-500">
            No recommendations available yet.
          </div>
        )}
      </Card>
    </DashboardSection>
  );
}
