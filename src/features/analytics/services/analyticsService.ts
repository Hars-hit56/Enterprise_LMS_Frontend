import type { AxiosError } from "axios";
import { apiClient } from "../../../services/apiClient";
import { API_ENDPOINT_ANALYTICS_INSTRUCTOR } from "../../../services/apiTypes";

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
        API_ENDPOINT_ANALYTICS_INSTRUCTOR,
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
