import type { AxiosError } from "axios";
import { apiClient } from "../../../services/apiClient";
import {
  API_ENDPOINT_ANALYTICS_ADMIN,
  API_ENDPOINT_ANALYTICS_INSTRUCTOR,
  API_ENDPOINT_ANALYTICS_STUDENT,
  API_ENDPOINT_RECOMMENDATIONS,
} from "../../../services/apiTypes";
import type { Course, Lesson } from "../../../types";

export interface InstructorAnalyticsResponse {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalRevenue: number;
  totalLessons: number;
  engagementData?: {
    name: string;
    enrollments: number;
    submissions: number;
  }[];
  progressData?: {
    name: string;
    progress: number;
    enrollments: number;
    completed: number;
  }[];
}

export interface AdminAnalyticsResponse {
  totalUsers: number;
  activeCourses: number;
  completionRate: number;

  totalRevenue: number;
  totalCourses: number;
  totalAdmin: number;
  totalInstructor: number;
  totalStudents: number;
  totalEnrolledStudent: number;
  totalLessons: number;
  engagementData?: {
    name: string;
    activeUsers: number;
    totalUsers: number;
  }[];
  progressData?: {
    name: string;
    progress: number;
    enrollments: number;
    completed: number;
  }[];
}

export interface StudentAnalyticsResponse {
  enrolledCourses: number;
  completedCourses: number;
  avgScore: number;
}

export interface StudentRecommendationCourse {
  course: Omit<Course, "price"> & {
    price?: string | number | null;
  };
  score: number;
  reason: string;
}

export interface StudentRecommendationMaterial {
  courseId: string;
  courseTitle: string;
  category: string;
  moduleTitle: string;
  lecture: Lesson;
  score: number;
  reason: string;
}

export interface StudentRecommendationsResponse {
  success: boolean;
  strategy: string;
  profile: {
    enrolledCourses: number;
    averageAssessmentScore: number;
    recommendedLevel: string;
    preferredCategories: string[];
  };
  courses: StudentRecommendationCourse[];
  materials: StudentRecommendationMaterial[];
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

  async getStudentAnalytics() {
    try {
      const response = await apiClient.get<StudentAnalyticsResponse>(
        API_ENDPOINT_ANALYTICS_STUDENT,
      );

      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to load student analytics."),
      );
    }
  },

  async getStudentRecommendations() {
    try {
      const response = await apiClient.get<StudentRecommendationsResponse>(
        API_ENDPOINT_RECOMMENDATIONS,
      );

      return response.data;
    } catch (error) {
      throw new Error(
        extractErrorMessage(error, "Failed to load recommendations."),
      );
    }
  },
};
