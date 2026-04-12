import { useEffect } from 'react'
import { useAssessmentStore } from '../store/assessmentStore'

export function useAssessments() {
  const assessments = useAssessmentStore((state) => state.assessments)
  const isLoading = useAssessmentStore((state) => state.isLoading)
  const fetchAssessments = useAssessmentStore((state) => state.fetchAssessments)

  useEffect(() => {
    void fetchAssessments()
  }, [fetchAssessments])

  return { assessments, isLoading }
}
