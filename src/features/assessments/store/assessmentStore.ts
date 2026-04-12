import { create } from 'zustand'
import type { Assessment } from '../../../types'
import { assessmentService } from '../services/assessmentService'

interface AssessmentState {
  assessments: Assessment[]
  isLoading: boolean
  fetchAssessments: () => Promise<void>
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  assessments: [],
  isLoading: false,
  fetchAssessments: async () => {
    set({ isLoading: true })
    const assessments = await assessmentService.getAssessments()
    set({ assessments, isLoading: false })
  },
}))
