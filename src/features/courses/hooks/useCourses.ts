import { useEffect } from 'react'
import type { UserRole } from '../../../types'
import { useCourseStore } from '../store/courseStore'

export function useCourses(role: UserRole) {
  const courses = useCourseStore((state) => state.courses)
  const isLoading = useCourseStore((state) => state.isLoading)
  const fetchCourses = useCourseStore((state) => state.fetchCourses)

  useEffect(() => {
    void fetchCourses(role)
  }, [fetchCourses, role])

  return { courses, isLoading }
}
