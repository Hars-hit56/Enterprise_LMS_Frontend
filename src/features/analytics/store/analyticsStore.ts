import { create } from 'zustand'
import type { StatWithIcon } from '../services/analyticsService'
import { analyticsService } from '../services/analyticsService'

interface AnalyticsState {
  studentStats: StatWithIcon[]
  instructorStats: StatWithIcon[]
  adminStats: StatWithIcon[]
  fetchStudentStats: () => Promise<void>
  fetchInstructorStats: () => Promise<void>
  fetchAdminStats: () => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  studentStats: [],
  instructorStats: [],
  adminStats: [],
  fetchStudentStats: async () => {
    const studentStats = await analyticsService.getStudentStats()
    set({ studentStats })
  },
  fetchInstructorStats: async () => {
    const instructorStats = await analyticsService.getInstructorStats()
    set({ instructorStats })
  },
  fetchAdminStats: async () => {
    const adminStats = await analyticsService.getAdminStats()
    set({ adminStats })
  },
}))
