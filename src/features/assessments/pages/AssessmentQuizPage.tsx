import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useAssessments } from "../hooks/useAssessments";

interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
}

const assessmentQuestions: Record<string, AssessmentQuestion[]> = {
  "a-201": [
    {
      id: "q-1",
      prompt: "What is the main benefit of component composition in React?",
      options: [
        "It removes the need for props",
        "It helps build reusable UI from smaller parts",
        "It replaces state management entirely",
        "It makes CSS unnecessary",
      ],
      correctAnswer: "It helps build reusable UI from smaller parts",
    },
    {
      id: "q-2",
      prompt: "Which hook is used for side effects?",
      options: ["useState", "useRef", "useEffect", "useMemo"],
      correctAnswer: "useEffect",
    },
    {
      id: "q-3",
      prompt: "Which prop is commonly used to help React identify list items?",
      options: ["index", "name", "key", "value"],
      correctAnswer: "key",
    },
    {
      id: "q-4",
      prompt:
        "Which hook is best for storing a local value that changes over time?",
      options: ["useId", "useState", "useRef", "useContext"],
      correctAnswer: "useState",
    },
    {
      id: "q-5",
      prompt: "What does lifting state up help with?",
      options: [
        "Sharing data between related components",
        "Removing all props",
        "Avoiding JSX",
        "Styling buttons faster",
      ],
      correctAnswer: "Sharing data between related components",
    },
    {
      id: "q-6",
      prompt:
        "Which file pattern is commonly used for reusable React components?",
      options: [
        "Single-purpose component files",
        "Only JSON files",
        "Only CSS files",
        "Only README files",
      ],
      correctAnswer: "Single-purpose component files",
    },
    {
      id: "q-7",
      prompt: "Why are props useful in React?",
      options: [
        "They pass data into components",
        "They replace routing",
        "They only style the UI",
        "They remove the need for state",
      ],
      correctAnswer: "They pass data into components",
    },
    {
      id: "q-8",
      prompt: "Which statement about JSX is correct?",
      options: [
        "JSX lets you write UI markup inside JavaScript",
        "JSX is required for CSS",
        "JSX disables components",
        "JSX only works in HTML files",
      ],
      correctAnswer: "JSX lets you write UI markup inside JavaScript",
    },
    {
      id: "q-9",
      prompt: "What is a common reason to split a UI into smaller components?",
      options: [
        "Better reuse and easier maintenance",
        "To avoid all imports",
        "To remove event handlers",
        "To stop rendering",
      ],
      correctAnswer: "Better reuse and easier maintenance",
    },
    {
      id: "q-10",
      prompt: "Which React pattern helps render lists efficiently and clearly?",
      options: [
        "Mapping arrays into components with keys",
        "Writing every item manually",
        "Using random values as IDs every render",
        "Avoiding arrays in UI code",
      ],
      correctAnswer: "Mapping arrays into components with keys",
    },
  ],
  "a-202": [
    {
      id: "q-1",
      prompt: "What improves keyboard accessibility most directly?",
      options: [
        "Using only div elements",
        "Removing focus styles",
        "Ensuring interactive elements are reachable by tab",
        "Adding more colors to the layout",
      ],
      correctAnswer: "Ensuring interactive elements are reachable by tab",
    },
    {
      id: "q-2",
      prompt: "What should every meaningful form field have?",
      options: ["A hover state", "A label", "An icon", "A border radius"],
      correctAnswer: "A label",
    },
    {
      id: "q-3",
      prompt: "Which contrast level is easier to read?",
      options: [
        "Low contrast text",
        "Text that blends into the background",
        "High contrast text",
        "Transparent text",
      ],
      correctAnswer: "High contrast text",
    },
    {
      id: "q-4",
      prompt: "What should happen when a modal opens?",
      options: [
        "Focus should move into the modal",
        "Focus should disappear",
        "The keyboard should stop working",
        "The page should refresh",
      ],
      correctAnswer: "Focus should move into the modal",
    },
    {
      id: "q-5",
      prompt: "Why are visible focus states important?",
      options: [
        "They help keyboard users know where they are",
        "They are only decorative",
        "They replace labels",
        "They are useful only on mobile",
      ],
      correctAnswer: "They help keyboard users know where they are",
    },
    {
      id: "q-6",
      prompt: "What is the purpose of alt text on informative images?",
      options: [
        "To describe the image for assistive technologies",
        "To increase border size",
        "To replace headings",
        "To hide images from users",
      ],
      correctAnswer: "To describe the image for assistive technologies",
    },
    {
      id: "q-7",
      prompt: "Which button label is most accessible?",
      options: ["Click here", "Submit assignment", "Open", "More"],
      correctAnswer: "Submit assignment",
    },
    {
      id: "q-8",
      prompt: "What improves readability in long forms?",
      options: [
        "Clear grouping and spacing",
        "Removing headings",
        "Using tiny fonts",
        "Hiding instructions",
      ],
      correctAnswer: "Clear grouping and spacing",
    },
    {
      id: "q-9",
      prompt: "When should error text appear for a field?",
      options: [
        "When validation fails and the user needs guidance",
        "Only on page load",
        "Never",
        "Only after logout",
      ],
      correctAnswer: "When validation fails and the user needs guidance",
    },
    {
      id: "q-10",
      prompt: "What is the best use of semantic HTML?",
      options: [
        "To give structure and meaning to content",
        "To avoid accessibility rules",
        "To replace all CSS",
        "To hide buttons",
      ],
      correctAnswer: "To give structure and meaning to content",
    },
  ],
  "a-203": [
    {
      id: "q-1",
      prompt: "What makes a chart easier to understand quickly?",
      options: [
        "Decorative effects only",
        "Clear labels and a focused message",
        "Too many colors",
        "Missing legends",
      ],
      correctAnswer: "Clear labels and a focused message",
    },
    {
      id: "q-2",
      prompt: "Which chart is often best for showing trends over time?",
      options: ["Pie chart", "Line chart", "Scatter icon", "Table only"],
      correctAnswer: "Line chart",
    },
    {
      id: "q-3",
      prompt: "What should a data story highlight first?",
      options: [
        "Every possible metric",
        "The most important takeaway",
        "Only technical jargon",
        "Random ordering",
      ],
      correctAnswer: "The most important takeaway",
    },
    {
      id: "q-4",
      prompt: "Which chart is usually best for comparing categories?",
      options: ["Bar chart", "Line chart", "Area blur", "Icon set only"],
      correctAnswer: "Bar chart",
    },
    {
      id: "q-5",
      prompt: "Why should chart titles be specific?",
      options: [
        "They help viewers understand the message quickly",
        "They replace the data source",
        "They remove the need for labels",
        "They are only for decoration",
      ],
      correctAnswer: "They help viewers understand the message quickly",
    },
    {
      id: "q-6",
      prompt: "What should be reduced in a clear dashboard?",
      options: [
        "Visual clutter",
        "Relevant insights",
        "Readable labels",
        "Data accuracy",
      ],
      correctAnswer: "Visual clutter",
    },
    {
      id: "q-7",
      prompt: "What helps viewers compare two values most easily?",
      options: [
        "Consistent scales",
        "Random axes",
        "Different measurement units without labels",
        "Decorative backgrounds",
      ],
      correctAnswer: "Consistent scales",
    },
    {
      id: "q-8",
      prompt: "When is annotation helpful in a chart?",
      options: [
        "When you need to call out an important point",
        "Only when there is no data",
        "To hide outliers",
        "To replace axis labels",
      ],
      correctAnswer: "When you need to call out an important point",
    },
    {
      id: "q-9",
      prompt: "What is a strong data-storytelling practice?",
      options: [
        "Ordering content from insight to support",
        "Showing all metrics equally",
        "Avoiding context",
        "Using unclear legends",
      ],
      correctAnswer: "Ordering content from insight to support",
    },
    {
      id: "q-10",
      prompt: "Which choice improves trust in a visualization?",
      options: [
        "Showing the source and labeling units clearly",
        "Hiding methodology",
        "Stretching axes without note",
        "Removing legends and notes",
      ],
      correctAnswer: "Showing the source and labeling units clearly",
    },
  ],
};

function getBackLink(courseId: string | null) {
  return courseId ?
      `/student/courses/${courseId}?source=my-courses`
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
  const [searchParams] = useSearchParams();
  const { assessments } = useAssessments();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const courseId = searchParams.get("courseId");

  const assessment = useMemo(
    () => assessments.find((item) => item.id === assessmentId),
    [assessmentId, assessments],
  );

  const questions = useMemo(
    () => (assessmentId ? (assessmentQuestions[assessmentId] ?? []) : []),
    [assessmentId],
  );

  const currentQuestion = questions[currentQuestionIndex];
  const progressWidth =
    questions.length > 0 ?
      ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;
  const answeredCount = Object.keys(selectedAnswers).length;
  const score = questions.reduce((total, question) => {
    return selectedAnswers[question.id] === question.correctAnswer ?
        total + 1
      : total;
  }, 0);

  useEffect(() => {
    setTimeRemaining(questions.length * 60 + 120);
  }, [questions.length, assessmentId]);

  useEffect(() => {
    if (isSubmitted || questions.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isSubmitted, questions.length]);

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
    <section className="mx-auto max-w-3xl space-y-5">
      <div className="space-y-2 text-center">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="w-full space-y-1">
            <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink-950 sm:text-[26px]">
              {assessment.title}
            </h1>
            <p className="text-[12px] text-ink-500">Test your knowledge</p>
          </div>
        </div>

        {!isSubmitted ?
          <div className="mx-auto max-w-3xl space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3 text-[12px] text-ink-500">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 shadow-[0_6px_14px_rgba(15,23,42,0.05)]">
                <Clock3 size={14} />
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-line-100">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        : null}
      </div>

      {!isSubmitted ?
        <Card className="mx-auto w-full max-w-3xl rounded-[26px] px-5 py-6 sm:px-7 sm:py-7">
          <div className="space-y-5 text-center">
            <div>
              <h2 className="text-[18px] font-semibold leading-7 text-ink-950">
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
                      isSelected ?
                        "border-brand-600 bg-brand-50 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
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
                    <span className="text-[14px] font-medium text-ink-950">
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

              {currentQuestionIndex < questions.length - 1 ?
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
              : <Button
                  className="gap-2 px-4 py-2.5 text-[12px]"
                  onClick={() => setIsSubmitted(true)}
                  disabled={answeredCount !== questions.length}
                >
                  Submit
                  <CheckCircle2 size={14} />
                </Button>
              }
            </div>
          </div>
        </Card>
      : <Card className="mx-auto w-full max-w-3xl rounded-[26px] px-5 py-6 sm:px-7 sm:py-7">
          <div className="space-y-5">
            <div className="space-y-3">
              <Badge tone={score === questions.length ? "success" : "brand"}>
                Result
              </Badge>
              <div>
                <h2 className="text-[20px] font-semibold text-ink-950">
                  You scored {score} out of {questions.length}
                </h2>
                <p className="mt-1 text-[12px] text-ink-500">
                  {Math.round((score / questions.length) * 100)}% correct
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((question, index) => {
                const selectedAnswer = selectedAnswers[question.id];
                const isCorrect = selectedAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className="rounded-[18px] border border-line-100 bg-soft/60 p-4"
                  >
                    <p className="text-[13px] font-medium text-ink-950">
                      {index + 1}. {question.prompt}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                      <Badge tone={isCorrect ? "success" : "warning"}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                      <Badge tone="neutral">
                        Your answer: {selectedAnswer ?? "Not answered"}
                      </Badge>
                      {!isCorrect ?
                        <Badge tone="brand">
                          Correct answer: {question.correctAnswer}
                        </Badge>
                      : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link to={getBackLink(courseId)}>
                <Button
                  variant="secondary"
                  className="gap-2 px-4 py-2.5 text-[12px]"
                >
                  <ArrowLeft size={16} />
                  Previous Screen
                </Button>
              </Link>
              <Button
                className="px-4 py-2.5 text-[12px]"
                onClick={() => {
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setIsSubmitted(false);
                  setTimeRemaining(questions.length * 60 + 120);
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      }
    </section>
  );
}
