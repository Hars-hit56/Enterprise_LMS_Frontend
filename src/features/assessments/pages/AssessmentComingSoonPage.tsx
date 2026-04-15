import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { Button } from "../../../components/ui/Button";
import { useAssessments } from "../hooks/useAssessments";

export function AssessmentComingSoonPage() {
  const { assessmentId } = useParams();
  const { assessments } = useAssessments();

  const assessment = useMemo(
    () => assessments.find((item) => item.id === assessmentId),
    [assessmentId, assessments],
  );

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
          {assessment?.title ?? "Assessment"}
        </h1>
        <p className="mt-1 text-[12px] text-ink-500">
          The assessment screen is being prepared for this course.
        </p>
      </div>

      <EmptyState
        title="Assessment Screen Coming Soon"
        description="You can already see the assessment list from My Courses. Opening and submitting the assessment will be added in the next step."
      />

      <div>
        <Link to="/student/my-courses">
          <Button variant="secondary" className="px-4 py-2 text-[12px]">
            Back to My Courses
          </Button>
        </Link>
      </div>
    </section>
  );
}
