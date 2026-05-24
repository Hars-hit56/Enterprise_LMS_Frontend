import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Target,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { AssessmentResult } from "../../../types";
import { useAssessments } from "../hooks/useAssessments";
import { assessmentService } from "../services/assessmentService";

function getBackLink(courseId: string | null) {
  return courseId
    ? `/student/courses/${courseId}?source=my-courses`
    : "/student/my-courses";
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function AssessmentQuizPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const { assessments } = useAssessments(courseId ?? undefined);
  const view = searchParams.get("view");

  const assessment = useMemo(
    () => assessments.find((item) => item.id === assessmentId),
    [assessmentId, assessments],
  );

  const questions = useMemo(
    () =>
      (assessment?.questions ?? []).map((question) => ({
        id: String(question.id),
        prompt: question.question,
        options: question.options,
        correctAnswer: question.options[question.correctIndex] ?? "",
      })),
    [assessment],
  );

  const initialDuration = questions.length * 60 + 120;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [isResultLoading, setIsResultLoading] = useState(view === "result");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const isSubmitted = view === "result" || Boolean(result);
  const visibleTimeRemaining = timeRemaining ?? initialDuration;

  const currentQuestion = questions[currentQuestionIndex];
  const progressWidth =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  const answeredCount = Object.keys(selectedAnswers).length;
  const score = result?.score ?? 0;
  const totalPoints = result?.totalPoints ?? 0;
  const correctCount = result?.correctCount ?? 0;
  const percentage = result?.percentage ?? 0;
  const incorrectCount = result?.incorrectCount ?? 0;
  const hasPassed = Boolean(result?.passed);

  useEffect(() => {
    if (view !== "result" || !assessmentId) {
      setResult(null);
      setResultError(null);
      setIsResultLoading(false);
      return;
    }

    const currentAssessmentId = assessmentId;
    let isMounted = true;

    async function loadResult() {
      setIsResultLoading(true);
      setResultError(null);

      try {
        const assessmentResult =
          await assessmentService.getAssessmentResult(currentAssessmentId);

        if (isMounted) {
          setResult(assessmentResult);
          setTimeRemaining(0);
        }
      } catch (error) {
        if (isMounted) {
          setResultError(
            error instanceof Error
              ? error.message
              : "Failed to load assessment result.",
          );
        }
      } finally {
        if (isMounted) {
          setIsResultLoading(false);
        }
      }
    }

    void loadResult();

    return () => {
      isMounted = false;
    };
  }, [assessmentId, view]);

  const submitAssessmentAnswers = useCallback(async () => {
    if (!assessmentId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setResultError(null);

    try {
      const answers = questions.map((question) => {
        const selectedAnswer = selectedAnswers[question.id];
        return Math.max(question.options.indexOf(selectedAnswer ?? ""), -1);
      });
      const assessmentResult = await assessmentService.submitAssessment(
        assessmentId,
        answers,
      );

      setResult(assessmentResult);
      setTimeRemaining(0);

      const nextSearchParams = new URLSearchParams();
      if (courseId) {
        nextSearchParams.set("courseId", courseId);
      }
      nextSearchParams.set("view", "result");

      navigate(
        `/student/assessments/${assessmentId}?${nextSearchParams.toString()}`,
        { replace: true },
      );
    } catch (error) {
      setResultError(
        error instanceof Error ? error.message : "Failed to submit assessment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    assessmentId,
    courseId,
    isSubmitting,
    navigate,
    questions,
    selectedAnswers,
  ]);

  useEffect(() => {
    if (isSubmitted || questions.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemaining((current) => {
        const currentTime = current ?? initialDuration;

        if (currentTime <= 1) {
          window.clearInterval(timer);
          setTimeRemaining(0);
          void submitAssessmentAnswers();
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    initialDuration,
    isSubmitted,
    questions,
    selectedAnswers,
    submitAssessmentAnswers,
  ]);

  const handleSubmit = () => {
    void submitAssessmentAnswers();
  };

  if (!assessment) {
    return (
      <section className="space-y-5">
        <EmptyState
          title="Assessment not found"
          description="We could not find that assessment. Try opening it again from the course detail page."
        />
        <div>
          <Link to={getBackLink(courseId)}>
            <Button variant="secondary" className="gap-2 px-4 py-2 text-[12px]">
              <ArrowLeft size={14} />
              Back
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (questions.length === 0) {
    return (
      <section className="space-y-5">
        <div>
          <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
            {assessment.title}
          </h1>
          <p className="mt-1 text-[12px] text-ink-500">
            The quiz content for this assessment is still being prepared.
          </p>
        </div>

        <EmptyState
          title="Questions Coming Soon"
          description="The assessment has been added, but questions have not been configured yet."
        />

        <div>
          <Link to={getBackLink(courseId)}>
            <Button variant="secondary" className="gap-2 px-4 py-2 text-[12px]">
              <ArrowLeft size={14} />
              Back
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <div className="space-y-2 text-center">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="w-full space-y-1">
            <h1 className="font-display text-[20px] font-semibold tracking-tight text-ink-950 sm:text-[22px]">
              {assessment.title}
            </h1>
            <p className="text-[12px] text-ink-500">Test your knowledge</p>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="mx-auto max-w-3xl space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3 text-[12px] text-ink-500">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 shadow-[0_6px_14px_rgba(15,23,42,0.05)]">
                <Clock3 size={14} />
                {formatTime(visibleTimeRemaining)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-line-100">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {!isSubmitted ? (
        <Card className="mx-auto w-full max-w-3xl rounded-[26px] px-5 py-6 sm:px-7 sm:py-7">
          <div className="space-y-5 text-center">
            <div>
              <h2 className="text-[14px] font-semibold leading-7 text-ink-950 sm:text-[18px]">
                {currentQuestion.prompt}
              </h2>
            </div>

            <div className="space-y-3 text-left">
              {currentQuestion.options.map((option) => {
                const isSelected =
                  selectedAnswers[currentQuestion.id] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-[16px] border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-brand-600 bg-brand-50 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
                        : "border-line-100 bg-white hover:border-brand-200 hover:bg-soft"
                    }`}
                    onClick={() =>
                      setSelectedAnswers((current) => ({
                        ...current,
                        [currentQuestion.id]: option,
                      }))
                    }
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border border-brand-500 text-brand-500`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isSelected ? "bg-brand-500" : "bg-transparent"
                        }`}
                      />
                    </span>
                    <span className="text-[12px] font-medium text-ink-950 sm:text-[14px]">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="secondary"
                className="gap-2 px-4 py-2.5 text-[12px]"
                onClick={() =>
                  setCurrentQuestionIndex((current) => Math.max(current - 1, 0))
                }
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft size={14} />
                Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  className="gap-2 px-4 py-2.5 text-[12px]"
                  onClick={() =>
                    setCurrentQuestionIndex((current) =>
                      Math.min(current + 1, questions.length - 1),
                    )
                  }
                  disabled={!selectedAnswers[currentQuestion.id]}
                >
                  Next
                  <ArrowRight size={14} />
                </Button>
              ) : (
                <Button
                  className="gap-2 px-4 py-2.5 text-[12px]"
                  onClick={handleSubmit}
                  disabled={answeredCount !== questions.length || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                  <CheckCircle2 size={14} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mx-auto w-full max-w-3xl !rounded-[24px] !px-3 !py-3 !sm:px-6 !sm:py-6 !sm:rounded-[24px]">
          {isResultLoading ? (
            <div className="space-y-4 p-4">
              <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-line-100" />
              <div className="mx-auto h-5 w-40 animate-pulse rounded bg-line-100" />
              <div className="h-28 animate-pulse rounded-[22px] bg-line-100" />
            </div>
          ) : resultError ? (
            <div className="space-y-4 p-4 text-center">
              <p className="text-sm font-medium text-danger-700">
                {resultError}
              </p>
              <Link to={getBackLink(courseId)}>
                <Button
                  variant="secondary"
                  className="gap-2 px-4 py-2.5 text-[12px]"
                >
                  <ArrowLeft size={16} />
                  Back to Assignment List
                </Button>
              </Link>
            </div>
          ) : !result ? (
            <div className="space-y-4 p-4 text-center">
              <p className="text-sm font-medium text-ink-500">
                No assessment result was found.
              </p>
              <Link to={getBackLink(courseId)}>
                <Button
                  variant="secondary"
                  className="gap-2 px-4 py-2.5 text-[12px]"
                >
                  <ArrowLeft size={16} />
                  Back to Assignment List
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-line-100 bg-[linear-gradient(180deg,#fff3f1_0%,#fff9f8_100%)]">
              <div className="space-y-4 px-4 py-6 text-center sm:space-y-5 sm:px-6 sm:py-7">
                <div
                  className={`mx-auto grid h-12 w-12 place-items-center rounded-full sm:h-14 sm:w-14 ${
                    hasPassed
                      ? "bg-success-100 text-success-700"
                      : "bg-danger-100 text-danger-700"
                  }`}
                >
                  {hasPassed ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <XCircle size={24} />
                  )}
                </div>

                <div className="space-y-2 px-2 ">
                  <Badge tone={hasPassed ? "success" : "warning"}>
                    {hasPassed ? "PASS" : "FAIL"}
                  </Badge>
                  <div>
                    <h2 className="text-[14px] font-semibold text-ink-950 sm:text-[16px]">
                      {assessment.title}
                    </h2>
                    <p className="mt-1 text-[9px] text-ink-500 sm:text-[13px]">
                      {hasPassed
                        ? "Nice work. Your submission has been recorded."
                        : "Don't give up - review and try again."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-line-100 bg-white px-4 py-5 sm:px-6 sm:py-6">
                <div className="text-center">
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-ink-500 sm:text-[10px]">
                    Your Score
                  </p>
                  <p
                    className={`mt-2 text-[16px] font-semibold leading-none sm:mt-4 sm:text-[30px] ${
                      hasPassed ? "text-success-700" : "text-danger-700"
                    }`}
                  >
                    {score}
                    <span className="text-[10px] text-ink-500 sm:text-[20px]">
                      {" "}
                      / {totalPoints}
                    </span>
                  </p>
                  <p
                    className={`mt-2 text-[16px] font-semibold leading-none sm:mt-3 sm:text-[24px] ${
                      hasPassed ? "text-success-700" : "text-danger-700"
                    }`}
                  >
                    {percentage}%
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3">
                  <div className="rounded-[18px] border border-line-100 bg-soft/60 p-3.5 text-center sm:p-4">
                    <Target className="mx-auto text-ink-500" size={18} />
                    <p className="mt-1 text-[16px] font-semibold text-ink-950 sm:mt-2 sm:text-[24px]">
                      {result.totalQuestions}
                    </p>
                    <p className="text-[10px] text-ink-500">Total</p>
                  </div>
                  <div className="rounded-[18px] border border-success-100 bg-success-50/80 p-3.5 text-center sm:p-4">
                    <CheckCircle2
                      className="mx-auto text-success-700"
                      size={18}
                    />
                    <p className="mt-1 text-[16px] font-semibold text-success-700 sm:mt-2 sm:text-[24px]">
                      {correctCount}
                    </p>
                    <p className="text-[10px] text-ink-500">Correct</p>
                  </div>
                  <div className="rounded-[18px] border border-danger-100 bg-danger-50/80 p-3.5 text-center sm:p-4">
                    <XCircle className="mx-auto text-danger-700" size={18} />
                    <p className="mt-1 text-[16px] font-semibold text-danger-700 sm:mt-2 sm:text-[24px]">
                      {incorrectCount}
                    </p>
                    <p className="text-[10px] text-ink-500">Incorrect</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {result.questionResults.map((question, index) => {
                return (
                  <div
                    key={question._id ?? `${question.question}-${index}`}
                    className="rounded-[18px] border border-line-100 bg-soft/60 p-3.5 sm:p-4"
                  >
                    <p className="text-[12px] font-medium text-ink-950 sm:text-[13px]">
                      {index + 1}. {question.question}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                      <Badge tone={question.isCorrect ? "success" : "warning"}>
                        {question.isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                      <Badge tone="neutral">
                        Your answer: {question.userAnswer || "Not answered"}
                      </Badge>
                      {!question.isCorrect ? (
                        <Badge tone="brand">
                          Correct answer: {question.correctAnswer}
                        </Badge>
                      ) : null}
                    </div>
                    {question.explanation ? (
                      <p className="mt-3 text-[12px] leading-5 text-ink-500">
                        {question.explanation}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link to={getBackLink(courseId)}>
                <Button
                  variant="secondary"
                  className="w-full gap-2 px-4 py-2.5 text-[12px] sm:w-auto"
                >
                  <ArrowLeft size={16} />
                  Back to Assignment List
                </Button>
              </Link>
            </div>
            </div>
          )}
        </Card>
      )}
    </section>
  );
}
