import { EmptyState } from '../../../components/common/EmptyState'
import { AssessmentList } from '../components/AssessmentList'
import { useAssessments } from '../hooks/useAssessments'

export function AssessmentsPage() {
  const { assessments, isLoading } = useAssessments()

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink-950">Assessments</h1>
        <p className="mt-2 text-base text-ink-500">
          Keep upcoming evaluations, grading windows, and completion signals in one place.
        </p>
      </div>
      {isLoading ? (
        <EmptyState title="Loading assessments" description="Pulling quizzes, assignments, and due dates." />
      ) : (
        <AssessmentList assessments={assessments} />
      )}
    </section>
  )
}
