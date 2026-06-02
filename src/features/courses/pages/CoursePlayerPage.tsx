import { Play } from "lucide-react";
import { useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { CoursePlayerSkeleton } from "../../../components/skeletons/CourseDetailSkeleton";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { AppDispatch } from "../../../store/store";
import type { Course, Lesson } from "../../../types";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCourseDetail } from "../hooks/useCourseDetail";
import { markLectureComplete } from "../store/courseStore";

interface LessonItem {
  id: string;
  title: string;
  duration: string;
  isPreview?: boolean;
  videoUrl?: string | null;
}

interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

function getLessonTitle(lesson: Lesson | string, index: number) {
  if (typeof lesson === "string") {
    return `Lecture ${index + 1}`;
  }

  return lesson.lectureTitle ?? lesson.title ?? `Lecture ${index + 1}`;
}

function buildModules(course: Course): ModuleItem[] {
  return (course.modules ?? []).map((module, moduleIndex) => {
    const lessons = module.lectures ?? module.lessons ?? [];

    return {
      id: String(module._id ?? module.id ?? `module-${moduleIndex}`),
      title: module.moduleTitle ?? module.title ?? `Module ${moduleIndex + 1}`,
      lessons: lessons.map((lesson, lessonIndex) => ({
        id:
          typeof lesson === "string"
            ? lesson
            : String(
                lesson._id ??
                  lesson.id ??
                  `lesson-${moduleIndex}-${lessonIndex}`,
              ),
        title: getLessonTitle(lesson, lessonIndex),
        duration: "Video lesson",
        isPreview: typeof lesson === "string" ? false : lesson.isPreviewFree,
        videoUrl: typeof lesson === "string" ? null : lesson.videoUrl,
      })),
    };
  });
}

export function CoursePlayerPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const completedLectureKeys = useRef(new Set<string>());
  const { user } = useAuth();
  const { course, isLoading } = useCourseDetail(courseId);
  const role = user?.role ?? "student";

  const modules = useMemo(() => (course ? buildModules(course) : []), [course]);
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
  const backLink =
    source === "edit"
      ? `/${role}/courses/edit/${courseId}`
      : `/${role}/courses/${courseId}?source=${source}`;
  const selectedLesson =
    allLessons.find((lesson) => lesson.id === lessonId) ?? allLessons[0];

  function handleVideoEnded() {
    const selectedCourseId = course?._id ?? course?.id ?? courseId;

    if (role !== "student" || !selectedCourseId || !selectedLesson?.id) {
      return;
    }

    const completionKey = `${selectedCourseId}:${selectedLesson.id}`;

    if (completedLectureKeys.current.has(completionKey)) {
      return;
    }

    completedLectureKeys.current.add(completionKey);
    void dispatch(
      markLectureComplete({
        courseId: selectedCourseId,
        lectureId: selectedLesson.id,
      }),
    )
      .unwrap()
      .catch(() => {
        completedLectureKeys.current.delete(completionKey);
      });
  }

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
          <Link to={backLink}>
            <Button variant="secondary" className="px-4 py-2 text-[12px]">
              {source === "edit"
                ? "Back to Edit Course"
                : "Back to Course Detail"}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      {/* Left Side - Video Section */}
      <div className="min-w-0 space-y-5">
        <Card className="space-y-4 overflow-hidden">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-[20px] bg-black">
              {selectedLesson.videoUrl ? (
                <video
                  src={selectedLesson.videoUrl}
                  controls
                  onEnded={handleVideoEnded}
                  className="aspect-video w-full bg-black"
                />
              ) : (
                <div className="grid aspect-video place-items-center bg-[linear-gradient(180deg,#dfe8f7_0%,#edf3fb_100%)] px-5 py-8 text-center">
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-white shadow-[0_14px_30px_rgba(37,100,240,0.28)]"
                    >
                      <Play size={24} />
                    </button>

                    <div>
                      <h2 className="text-[18px] font-semibold text-ink-950 sm:text-[22px]">
                        {selectedLesson.title}
                      </h2>

                      <p className="mt-1 text-[12px] text-ink-500 sm:text-[13px]">
                        No video URL is available for this lesson.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-[18px] font-semibold text-ink-950 sm:text-[22px]">
                {selectedLesson.title}
              </h3>

              <p className="text-[12px] text-ink-500 sm:text-[13px]">
                {selectedLesson.moduleTitle} • Lesson{" "}
                {selectedLesson.lessonIndex + 1} of {allLessons.length}
              </p>
            </div>
          </section>
        </Card>

        <div>
          <Link to={backLink}>
            <Button
              variant="secondary"
              className="w-full px-4 py-2 text-[12px] sm:w-auto"
            >
              {source === "edit"
                ? "Back to Edit Course"
                : "Back to Course Detail"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Side - Playlist / Lessons */}
      <div className="space-y-4">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-line-100 px-4 py-3">
            <h3 className="text-[14px] font-semibold text-ink-950">
              Course Content
            </h3>

            <p className="mt-1 text-[12px] text-ink-500">
              {allLessons.length} lessons
            </p>
          </div>

          <div className="max-h-[80vh] overflow-y-auto">
            {allLessons.map((lesson, index) => {
              const active = lesson.id === selectedLesson.id;

              return (
                <button
                  key={lesson.id}
                  className={`flex w-full items-start gap-3 border-b border-line-100 px-4 py-3 text-left transition hover:bg-soft ${
                    active ? "bg-brand-50" : ""
                  }`}
                >
                  <div
                    className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-medium ${
                      active
                        ? "bg-brand-500 text-white"
                        : "bg-soft text-ink-700"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink-950">
                      {lesson.title}
                    </p>

                    <p className="mt-1 text-[11px] text-ink-500">
                      {lesson.moduleTitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
}
