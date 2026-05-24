import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  Play,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { CourseDetailSkeleton } from "../../../components/skeletons/CourseDetailSkeleton";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Toast } from "../../../components/ui/Toast";
import type { AppDispatch, RootState } from "../../../store/store";
import type { Assessment, Course, Lesson } from "../../../types";
import { useAssessments } from "../../assessments/hooks/useAssessments";
import { assessmentService } from "../../assessments/services/assessmentService";
import { useCourseDetail } from "../hooks/useCourseDetail";
import { clearPurchaseError, purchaseCourse } from "../store/courseStore";

type CourseDetailSource =
  | "catalog"
  | "recommended"
  | "my-courses"
  | "dashboard";

interface LessonItem {
  id: string;
  title: string;
  isPreview?: boolean;
}

interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
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
        isPreview: typeof lesson === "string" ? false : lesson.isPreviewFree,
      })),
    };
  });
}

function formatCoursePrice(course: Course) {
  if (course.isFree) {
    return "Free";
  }

  const currency =
    course.currency === "INR" ? "\u20B9" : (course.currency ?? "");
  const price =
    typeof course.price === "number"
      ? new Intl.NumberFormat("en-IN").format(course.price)
      : course.price;

  return `${currency} ${price}`.trim();
}

function isImageUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function AssessmentListItem({
  assessment,
  onOpen,
}: {
  assessment: Assessment;
  onOpen: (assessmentId: string, hasResult: boolean) => void;
}) {
  const [hasResult, setHasResult] = useState(false);
  const questionCount = assessment.questions?.length ?? 0;

  useEffect(() => {
    let isMounted = true;

    async function loadResultStatus() {
      try {
        await assessmentService.getAssessmentResult(assessment.id);

        if (isMounted) {
          setHasResult(true);
        }
      } catch {
        if (isMounted) {
          setHasResult(false);
        }
      }
    }

    void loadResultStatus();

    return () => {
      isMounted = false;
    };
  }, [assessment.id]);

  return (
    <div className="rounded-[22px] border border-line-100 bg-white p-3">
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <FileText size={14} />
          </div>
          <div className="flex-1">
            <h3 className="text-[12px] font-semibold text-ink-950">
              {assessment.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-[10px] text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <ClipboardCheck size={12} />
                {questionCount} Questions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={12} />
                {assessment.timeLimit ?? "15 min"}
              </span>
            </div>
          </div>
          <Badge tone={hasResult ? "success" : "neutral"} className="!text-[8px]">
            {hasResult ? "Completed" : "Not Started"}
          </Badge>
        </div>

        <Button
          type="button"
          fullWidth
          variant={hasResult ? "secondary" : "primary"}
          className="!gap-2 !py-2 !text-[12px]"
          onClick={() => onOpen(assessment.id, hasResult)}
        >
          {hasResult ? <Eye size={14} /> : <Play size={14} />}
          {hasResult ? "View Result" : "Start Test"}
        </Button>
      </div>
    </div>
  );
}

export function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { course, isLoading, error } = useCourseDetail(courseId);
  const { isPurchasing, purchaseError } = useSelector(
    (state: RootState) => state.courses,
  );
  const { assessments } = useAssessments(courseId);
  const source = getSource(searchParams, course ?? undefined);
  const effectiveSource = course?.isEnrolled ? "my-courses" : source;
  const showAssessmentListCard = effectiveSource === "my-courses";
  const isPurchaseView =
    !course?.isEnrolled && (source === "catalog" || source === "recommended");
  const canOpenLessons = Boolean(course?.isEnrolled);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

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

  const [openModuleIds, setOpenModuleIds] = useState<string[] | null>(null);
  const defaultOpenModuleIds = modules.slice(0, 2).map((module) => module.id);
  const visibleOpenModuleIds =
    openModuleIds === null ? defaultOpenModuleIds : openModuleIds;
  const activeLesson =
    allLessons.find((lesson) => course?.nextLesson?.includes(lesson.title)) ??
    allLessons[0];

  const courseAssessments = useMemo(() => {
    if (!course) {
      return [];
    }

    return assessments.filter(
      (assessment) =>
        !assessment.courseId ||
        assessment.courseId === course.id ||
        assessment.course === course.id ||
        assessment.course === course.title,
    );
  }, [assessments, course]);

  async function handlePurchaseCourse() {
    if (!course?.id) {
      return;
    }

    setPurchaseMessage(null);
    dispatch(clearPurchaseError());

    try {
      const result = await dispatch(purchaseCourse(course.id)).unwrap();
      setPurchaseMessage(result.message);
      navigate(`/student/courses/${course.id}?source=my-courses`, {
        replace: true,
      });
    } catch {
      setPurchaseMessage(null);
    }
  }

  function openAssessment(assessmentId: string, hasResult: boolean) {
    navigate(
      `/student/assessments/${assessmentId}?courseId=${course?.id ?? ""}${hasResult ? "&view=result" : ""}`,
    );
  }

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return <p className="text-sm font-medium text-danger-700">{error}</p>;
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
      {purchaseError ? (
        <Toast
          message={purchaseError}
          type="error"
          onClose={() => dispatch(clearPurchaseError())}
        />
      ) : null}
      {purchaseMessage ? (
        <Toast
          message={purchaseMessage}
          type="success"
          onClose={() => setPurchaseMessage(null)}
        />
      ) : null}

      <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(135deg,#2564f0_0%,#4c63e6_100%)] p-0 text-white shadow-[0_22px_45px_rgba(37,100,240,0.24)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{course.level}</Badge>
            <Badge tone="neutral">{course.category}</Badge>
            {course.isEnrolled ? <Badge tone="success">Enrolled</Badge> : null}
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
              {course.rating}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} />
              {course.students ?? 0} students
            </span>
            {/* <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {course.duration}
            </span> */}
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={14} />
              {course.lessons ?? allLessons.length} lessons
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-brand-50 text-[24px]">
                {isImageUrl(course.thumbnail) ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  course.thumbnail
                )}
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
              {typeof course.progress === "number" && course.isEnrolled ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1.5 text-success-700">
                  <CheckCircle2 size={14} />
                  {course.progress}% completed
                </span>
              ) : null}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold text-ink-950">
                Course Content
              </h2>
              <p className="mt-1 text-[12px] text-ink-500">
                {modules.length} modules • {allLessons.length} lessons
              </p>
            </div>

            {modules.length > 0 ? (
              <div className="space-y-3">
                {modules.map((module) => {
                  const isOpen = visibleOpenModuleIds.includes(module.id);

                  return (
                    <div
                      key={module.id}
                      className="rounded-[18px] border border-line-100"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                        onClick={() =>
                          setOpenModuleIds((current) => {
                            const currentOpenIds =
                              current === null ? defaultOpenModuleIds : current;

                            return currentOpenIds.includes(module.id)
                              ? currentOpenIds.filter((id) => id !== module.id)
                              : [...currentOpenIds, module.id];
                          })
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

                      {isOpen ? (
                        <div className="space-y-1 border-t border-line-100 px-4 py-3">
                          {module.lessons.map((lesson) => {
                            const isSelected = lesson.id === activeLesson?.id;

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                disabled={!canOpenLessons}
                                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                                  canOpenLessons
                                    ? "hover:bg-soft"
                                    : "cursor-default opacity-70"
                                } ${isSelected ? "bg-brand-50" : ""}`}
                                onClick={() => {
                                  if (!canOpenLessons) {
                                    return;
                                  }

                                  navigate(
                                    `/student/courses/${course.id}/learn?lessonId=${lesson.id}&source=${effectiveSource}`,
                                  );
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <CheckCircle2
                                    size={16}
                                    className={
                                      canOpenLessons
                                        ? "text-brand-600"
                                        : "text-ink-500"
                                    }
                                  />
                                  <div>
                                    <p className="text-[13px] font-medium text-ink-950">
                                      {lesson.title}
                                    </p>
                                    {lesson.isPreview && !canOpenLessons ? (
                                      <p className="text-[11px] text-ink-500">
                                        Preview lesson
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line-200 px-4 py-5 text-[12px] text-ink-500">
                No course content has been added yet.
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {isPurchaseView ? (
            <Card className="space-y-4">
              <div className="space-y-1">
                <p className="text-[12px] font-medium text-ink-500">
                  Course Price
                </p>
                <h2 className="text-[24px] font-semibold tracking-tight text-ink-950">
                  {formatCoursePrice(course)}
                </h2>
                <p className="text-[12px] text-ink-500">
                  One-time access to the full course, downloadable resources,
                  and future lesson updates.
                </p>
              </div>
              <Button
                type="button"
                fullWidth
                className="py-3 text-[13px]"
                disabled={isPurchasing}
                onClick={handlePurchaseCourse}
              >
                {isPurchasing ? "Processing..." : "Subscribe"}
              </Button>
            </Card>
          ) : showAssessmentListCard ? (
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 p-2 text-brand-600">
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
                {courseAssessments.length > 0 ? (
                  courseAssessments.map((assessment) => (
                    <AssessmentListItem
                      key={assessment.id}
                      assessment={assessment}
                      onOpen={openAssessment}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-line-200 px-4 py-5 text-[12px] text-ink-500">
                    No assessments have been added for this course yet.
                  </div>
                )}
              </div>
            </Card>
          ) : typeof course.progress === "number" ? (
            <Card className="space-y-4">
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
                disabled={!activeLesson}
                onClick={() =>
                  navigate(
                    `/student/courses/${course.id}/learn?lessonId=${activeLesson?.id ?? ""}&source=${effectiveSource}`,
                  )
                }
              >
                Continue Learning
              </Button>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
