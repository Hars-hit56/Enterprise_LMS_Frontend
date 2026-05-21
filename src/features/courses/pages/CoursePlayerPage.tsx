import { CheckCircle2, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { CoursePlayerSkeleton } from "../../../components/skeletons/CourseDetailSkeleton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { Course } from "../../../types";
import { useCourses } from "../hooks/useCourses";

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

export function CoursePlayerPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const { courses, isLoading } = useCourses("student");
  const course = courses.find((item) => item.id === courseId);

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

  const lessonId = searchParams.get("lessonId");
  const source = searchParams.get("source") ?? "my-courses";
  const [, setCompletedLessonIds] = useState<string[]>([]);
  const selectedLesson =
    allLessons.find((lesson) => lesson.id === lessonId) ?? allLessons[0];

  if (isLoading) {
    return <CoursePlayerSkeleton />;
  }

  if (!course || !selectedLesson) {
    return (
      <section className="space-y-5">
        <EmptyState
          title="Video not found"
          description="We could not load that lesson yet. Try opening it again from the course detail page."
        />
        <div>
          <Link to={`/student/courses/${courseId}?source=${source}`}>
            <Button variant="secondary" className="px-4 py-2 text-[12px]">
              Back to Course Detail
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <Card className="space-y-4">
        <section className="space-y-4">
          <div className="grid min-h-[400px] place-items-center rounded-[24px] bg-[linear-gradient(180deg,#dfe8f7_0%,#edf3fb_100%)] px-5 py-8 text-center">
            <div className="space-y-3">
              <button
                type="button"
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-white shadow-[0_14px_30px_rgba(37,100,240,0.28)]"
              >
                <Play size={24} />
              </button>
              <div>
                <h2 className="text-[22px] font-semibold text-ink-950">
                  {selectedLesson.title}
                </h2>
                <p className="mt-1 text-[12px] text-ink-500">
                  {selectedLesson.duration} • Module{" "}
                  {selectedLesson.moduleIndex + 1}, Lesson{" "}
                  {selectedLesson.lessonIndex + 1}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-[24px] font-semibold text-ink-950">
                {selectedLesson.title}
              </h3>
              <p className="mt-1 text-[13px] text-ink-500">
                {selectedLesson.moduleTitle} • Lesson{" "}
                {selectedLesson.lessonIndex + 1} of {allLessons.length}
              </p>
            </div>
            <Button
              type="button"
              className="gap-2 self-start px-4 py-3 text-[13px]"
              onClick={() => {
                setCompletedLessonIds((current) =>
                  current.includes(selectedLesson.id)
                    ? current
                    : [...current, selectedLesson.id],
                );
              }}
            >
              <CheckCircle2 size={14} />
              Mark as Complete
            </Button>
          </div>
        </section>
      </Card>

      {/* <Card className="space-y-4">
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
                      current.includes(module.id)
                        ? current.filter((id) => id !== module.id)
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
                      const isSelected = lesson.id === selectedLesson.id;
                      const isCompleted = completedLessonIds.includes(
                        lesson.id,
                      );

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-soft ${isSelected ? "bg-brand-50" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle2
                                size={16}
                                className="text-success-700"
                              />
                            ) : (
                              <Play size={16} className="text-brand-600" />
                            )}
                            <div>
                              <p className="text-[13px] font-medium text-ink-950">
                                {lesson.title}
                              </p>
                              {lesson.isPreview && (
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
      </Card> */}

      <div>
        <Link to={`/student/courses/${courseId}?source=${source}`}>
          <Button variant="secondary" className="px-4 py-2 text-[12px]">
            Back to Course Detail
          </Button>
        </Link>
      </div>
    </section>
  );
}
