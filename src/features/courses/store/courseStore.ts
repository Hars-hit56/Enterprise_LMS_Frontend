import { create } from 'zustand'
import type { Course, UserRole } from '../../../types'
import { courseService } from '../services/courseService'

interface CourseState {
  courses: Course[]
  isLoading: boolean
  fetchCourses: (role: UserRole) => Promise<void>
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  isLoading: false,
  fetchCourses: async (role) => {
    set({ isLoading: true })
    const courses = await courseService.getCourses(role)
    set({ courses, isLoading: false })
  },
}))
