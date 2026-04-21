import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AssessmentAttempt {
  assessmentId: string;
  score: number;
  totalQuestions: number;
  selectedAnswers: Record<string, string>;
  submittedAt: string;
}

interface AssessmentAttemptState {
  attempts: Record<string, AssessmentAttempt>;
  saveAttempt: (attempt: AssessmentAttempt) => void;
  clearAttempt: (assessmentId: string) => void;
}

export const useAssessmentAttemptStore = create<AssessmentAttemptState>()(
  persist(
    (set) => ({
      attempts: {},
      saveAttempt: (attempt) =>
        set((state) => ({
          attempts: {
            ...state.attempts,
            [attempt.assessmentId]: attempt,
          },
        })),
      clearAttempt: (assessmentId) =>
        set((state) => {
          const attempts = { ...state.attempts };
          delete attempts[assessmentId];

          return { attempts };
        }),
    }),
    { name: "learnhub-assessment-attempts" },
  ),
);
