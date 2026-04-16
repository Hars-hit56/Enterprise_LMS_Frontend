import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Users,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { Course } from "../../../types";
import { useAssessments } from "../../assessments/hooks/useAssessments";
import { useCourses } from "../hooks/useCourses";

type CourseDetailSource =
  | "catalog"
  | "recommended"
  | "my-courses"
  | "dashboard";

interface LessonItem {
  id: string;
  title: string;
  duration: string;
  isPreview?: boolean;
}

interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

const courseCurriculum: Record<string, ModuleItem[]> = {
  "c-101": [
    {
      id: "m-1",
      title: "Getting Started",
      lessons: [
        { id: "l-1", title: "Course Overview", duration: "5 min" },
        { id: "l-2", title: "Setting Up Your Environment", duration: "12 min" },
        { id: "l-3", title: "Core Concepts", duration: "18 min" },
      ],
    },
    {
      id: "m-2",
      title: "Component Patterns",
      lessons: [
        { id: "l-4", title: "Compound Components", duration: "22 min" },
        { id: "l-5", title: "Render Props Pattern", duration: "20 min" },
        { id: "l-6", title: "Custom Hooks", duration: "25 min" },
      ],
    },
    {
      id: "m-3",
      title: "State Management",
      lessons: [
        { id: "l-7", title: "Context Boundaries", duration: "17 min" },
        { id: "l-8", title: "Reducer Patterns", duration: "21 min" },
        { id: "l-9", title: "Composing State APIs", duration: "19 min" },
      ],
    },
    {
      id: "m-4",
      title: "Performance",
      lessons: [
        { id: "l-10", title: "Memoization Strategy", duration: "14 min" },
        { id: "l-11", title: "Code Splitting", duration: "16 min" },
        { id: "l-12", title: "Pattern Tradeoffs", duration: "11 min" },
      ],
    },
  ],
  "c-104": [
    {
      id: "m-1",
      title: "Foundations",
      lessons: [
        {
          id: "l-1",
          title: "Type System Basics",
          duration: "9 min",
          isPreview: true,
        },
        {
          id: "l-2",
          title: "Working with Unions",
          duration: "14 min",
          isPreview: true,
        },
      ],
    },
    {
      id: "m-2",
      title: "Advanced Typing",
      lessons: [
        { id: "l-3", title: "Generics in Practice", duration: "18 min" },
        { id: "l-4", title: "Conditional Types", duration: "22 min" },
      ],
    },
  ],
};

function buildFallbackCurriculum(course: Course): ModuleItem[] {
  return [
    {
      id: `${course.id}-m-1`,
      title: "Overview",
      lessons: [
        {
          id: `${course.id}-l-1`,
          title: `${course.title} Kickoff`,
          duration: "8 min",
          isPreview: true,
        },
        {
          id: `${course.id}-l-2`,
          title: `Core ${course.category} Concepts`,
          duration: "16 min",
        },
      ],
    },
    {
      id: `${course.id}-m-2`,
      title: "Applied Learning",
      lessons: [
        {
          id: `${course.id}-l-3`,
          title: "Practical Walkthrough",
          duration: "20 min",
        },
        {
          id: `${course.id}-l-4`,
          title: "Capstone Exercise",
          duration: "24 min",
        },
      ],
    },
  ];
}

function getSource(
  searchParams: URLSearchParams,
  course?: Course,
): CourseDetailSource {
  const rawSource = searchParams.get("source");

  if (
    rawSource === "catalog" ||
    rawSource === "recommended" ||
    rawSource === "my-courses" ||
    rawSource === "dashboard"
  ) {
    return rawSource;
  }

  return course?.isEnrolled ? "dashboard" : "catalog";
}

export function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courses, isLoading } = useCourses("student");
  const { assessments } = useAssessments();
  const course = courses.find((item) => item.id === courseId);
  const source = getSource(searchParams, course);
  const showAssessmentListCard = source === "my-courses";
  const isPurchaseView = source === "catalog" || source === "recommended";
  const canOpenLessons = source === "my-courses";

  const modules = useMemo(() => {
    if (!course) {
      return [];
    }

    return courseCurriculum[course.id] ?? buildFallbackCurriculum(course);
  }, [course]);

  const allLessons = useMemo(
    () =>
      modules.flatMap((module, moduleIndex) =>
        module.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          moduleId: module.id,
          moduleTitle: module.title,
          moduleIndex,
          lessonIndex,
        })),
      ),
    [modules],
  );

  const [openModuleIds, setOpenModuleIds] = useState<string[]>([]);

  useEffect(() => {
    if (modules.length > 0 && openModuleIds.length === 0) {
      setOpenModuleIds(modules.slice(0, 2).map((module) => module.id));
    }
  }, [modules, openModuleIds.length]);

  const activeLesson =
    allLessons.find((lesson) => course?.nextLesson?.includes(lesson.title)) ??
    allLessons[0];

  const courseAssessments = useMemo(() => {
    if (!course) {
      return [];
    }

    return assessments.filter(
      (assessment) => assessment.course === course.title,
    );
  }, [assessments, course]);

  if (isLoading) {
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

  if (!course) {
    return (
      <section className="space-y-5">
        <EmptyState
          title="Course not found"
          description="We could not find that course. Try opening it again from the course list or dashboard."
        />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(135deg,#2564f0_0%,#4c63e6_100%)] p-0 text-white shadow-[0_22px_45px_rgba(37,100,240,0.24)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{course.level}</Badge>
            <Badge tone="neutral">{course.category}</Badge>
            {course.isEnrolled && <Badge tone="success">Enrolled</Badge>}
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-[20px] font-semibold tracking-tight text-white sm:text-[26px]">
              {course.title}
            </h1>
            <p className="max-w-3xl text-[13px] leading-6 text-white/82 sm:text-[14px]">
              {course.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/88">
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="fill-white text-white" />
              {course.rating} ({course.students.toLocaleString()} learners)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} />
              {course.students.toLocaleString()} students
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={14} />
              {course.lessons} lessons
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-[24px]">
                {course.thumbnail}
              </div>
              <div>
                <p className="text-[14px] font-medium text-ink-950">
                  {course.instructor}
                </p>
                <p className="text-[12px] text-ink-500">
                  Instructor of {course.category} courses and hands-on learning
                  tracks
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-ink-500">
              {course.isEnrolled && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1.5 text-success-700">
                  <CheckCircle2 size={14} />
                  {course.progress}% completed
                </span>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold text-ink-950">
                Course Content
              </h2>
              <p className="mt-1 text-[12px] text-ink-500">
                {modules.length} modules • {allLessons.length} lessons •{" "}
                {course.duration} total
              </p>
            </div>

            <div className="space-y-3">
              {modules.map((module) => {
                const isOpen = openModuleIds.includes(module.id);

                return (
                  <div
                    key={module.id}
                    className="rounded-[18px] border border-line-100"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                      onClick={() =>
                        setOpenModuleIds((current) =>
                          current.includes(module.id) ?
                            current.filter((id) => id !== module.id)
                          : [...current, module.id],
                        )
                      }
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-medium text-ink-950">
                          {module.title}
                        </span>
                        <span className="rounded-full bg-line-100 px-2 py-1 text-[10px] font-medium text-ink-500">
                          {module.lessons.length} lessons
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-ink-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="space-y-1 border-t border-line-100 px-4 py-3">
                        {module.lessons.map((lesson) => {
                          const isSelected = lesson.id === activeLesson?.id;

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              disabled={!canOpenLessons}
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                                canOpenLessons ? "hover:bg-soft" : (
                                  "cursor-default opacity-70"
                                )
                              } ${isSelected ? "bg-brand-50" : ""}`}
                              onClick={() => {
                                if (!canOpenLessons) {
                                  return;
                                }

                                navigate(
                                  `/student/courses/${course.id}/learn?lessonId=${lesson.id}&source=${source}`,
                                );
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <CheckCircle2
                                  size={16}
                                  className={
                                    canOpenLessons ? "text-brand-600" : (
                                      "text-ink-500"
                                    )
                                  }
                                />
                                <div>
                                  <p className="text-[13px] font-medium text-ink-950">
                                    {lesson.title}
                                  </p>
                                  {lesson.isPreview && !canOpenLessons && (
                                    <p className="text-[11px] text-ink-500">
                                      Preview lesson
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-[11px] text-ink-500">
                                {lesson.duration}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {isPurchaseView ?
            <Card className="space-y-4">
              <div className="space-y-1">
                <p className="text-[12px] font-medium text-ink-500">
                  Course Price
                </p>
                <h2 className="text-[24px] font-semibold tracking-tight text-ink-950">
                  {course.price}
                </h2>
                <p className="text-[12px] text-ink-500">
                  One-time access to the full course, downloadable resources,
                  and future lesson updates.
                </p>
              </div>
              <Button fullWidth className="py-3 text-[13px]">
                Buy Now
              </Button>
            </Card>
          : showAssessmentListCard ?
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-brand-50 p-2 text-brand-600">
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-ink-950">
                    Assessment List
                  </h2>
                  <p className="mt-1 text-[12px] text-ink-500">
                    Open the assessments mapped to this course.
                  </p>
                </div>
              </div>

              <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                {courseAssessments.length > 0 ?
                  courseAssessments.map((assessment) => (
                    <button
                      key={assessment.id}
                      type="button"
                      className="w-full rounded-2xl border border-line-100 px-4 py-3 text-left transition hover:border-brand-200 hover:bg-soft"
                      onClick={() =>
                        navigate(
                          `/student/assessments/${assessment.id}?courseId=${course.id}`,
                        )
                      }
                    >
                      <div>
                        <p className="text-[13px] font-medium text-ink-950">
                          {assessment.title}
                        </p>
                        <p className="mt-1 text-[11px] text-ink-500">
                          Due {assessment.dueDate}
                        </p>
                      </div>
                    </button>
                  ))
                : <div className="rounded-2xl border border-dashed border-line-200 px-4 py-5 text-[12px] text-ink-500">
                    No assessments have been added for this course yet.
                  </div>
                }
              </div>
            </Card>
          : <Card className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium text-ink-950">
                    Your Progress
                  </p>
                  <p className="mt-1 text-[12px] text-ink-500">
                    {course.progress}% completed
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-brand-600">
                  {course.progress}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-line-100">
                <div
                  className="h-2 rounded-full bg-brand-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <Button
                fullWidth
                className="py-3 text-[13px]"
                onClick={() =>
                  navigate(
                    `/student/courses/${course.id}/learn?lessonId=${activeLesson?.id ?? ""}&source=${source}`,
                  )
                }
              >
                Continue Learning
              </Button>

              <div className="space-y-2 text-[12px] text-ink-500">
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-600" />
                  Next up:{" "}
                  {course.nextLesson ?? "Continue from your latest lesson"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Clock3 size={14} className="text-brand-600" />
                  Lifetime access
                </p>
              </div>
            </Card>
          }
        </div>
      </div>
    </section>
  );
}
