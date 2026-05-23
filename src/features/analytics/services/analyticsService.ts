import type { AxiosError } from "axios";
import { apiClient } from "../../../services/apiClient";
import {
  API_ENDPOINT_ANALYTICS_ADMIN,
  API_ENDPOINT_ANALYTICS_INSTRUCTOR,
} from "../../../services/apiTypes";

export interface InstructorAnalyticsResponse {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalRevenue: number;
  totalLessons: number;
}

export interface AdminAnalyticsResponse {
  totalUsers: number;
  activeCourses: number;
  completionRate: number;

  //Remaining field in API's we should add it
  totalRevenue: number;
  totalCourses: number;
  totalInstructor: number;
  totalStudents: number;
  totalEnrolledStudent: number;
  totalLessons: number;
}

function extractErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{
    message?: string;
    error?: string;
  }>;
  const message =
    axiosError.response?.data?.message ?? axiosError.response?.data?.error;

  return message ?? fallback;
}

export const analyticsService = {
  async getInstructorAnalytics() {
    try {
      const response = await apiClient.get<InstructorAnalyticsResponse>(
        API_ENDPOINT_ANALYTICS_INSTRUCTOR,
      );

      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to load instructor analytics."),
      );
    }
  },

  async getAdminAnalytics() {
    try {
      const response = await apiClient.get<AdminAnalyticsResponse>(
        API_ENDPOINT_ANALYTICS_ADMIN,
      );

      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to load admin analytics."),
      );
    }
  },
};
