import type { AxiosError } from "axios";
import { apiClient } from "../../../services/apiClient";

export interface InstructorAnalyticsResponse {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalRevenue: number;
  totalLessons: number;
}

export const analyticsService = {
  async getInstructorAnalytics() {
    try {
      const response = await apiClient.get<InstructorAnalyticsResponse>(
        "/api/analytics/instructor",
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to load instructor analytics.");
    }
  },
};
