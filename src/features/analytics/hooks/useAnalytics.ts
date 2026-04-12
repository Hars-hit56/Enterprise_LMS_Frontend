import { useEffect } from 'react'
import { useAnalyticsStore } from '../store/analyticsStore'

export function useStudentAnalytics() {
  const studentStats = useAnalyticsStore((state) => state.studentStats)
  const fetchStudentStats = useAnalyticsStore((state) => state.fetchStudentStats)

  useEffect(() => {
    void fetchStudentStats()
  }, [fetchStudentStats])

  return studentStats
}

export function useInstructorAnalytics() {
  const instructorStats = useAnalyticsStore((state) => state.instructorStats)
  const fetchInstructorStats = useAnalyticsStore((state) => state.fetchInstructorStats)

  useEffect(() => {
    void fetchInstructorStats()
  }, [fetchInstructorStats])

  return instructorStats
}

export function useAdminAnalytics() {
  const adminStats = useAnalyticsStore((state) => state.adminStats)
  const fetchAdminStats = useAnalyticsStore((state) => state.fetchAdminStats)

  useEffect(() => {
    void fetchAdminStats()
  }, [fetchAdminStats])

  return adminStats
}
