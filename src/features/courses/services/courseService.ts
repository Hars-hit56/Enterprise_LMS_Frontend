import type { Course, CourseFormData, UserRole } from "../../../types";
import { apiClient } from "../../../services/apiClient";
import {
  API_ENDPOINT_COURSE_CREATE,
  API_ENDPOINT_COURSE_EDIT,
  API_ENDPOINT_COURSE_GET_BY_ID,
  API_ENDPOINT_COURSE_GET_CREATOR,
  API_ENDPOINT_COURSE_REMOVE,
} from "../../../services/apiTypes";
import type { AxiosError } from "axios";

type CreatorCoursesApiResponse =
  | Course
  | Course[]
  | { data: Course | Course[] };

type DeleteCourseApiResponse = {
  message?: string;
};

type UpdateCourseStatusApiResponse =
  | Course
  | {
      data?: Course;
      message?: string;
    };

type FormDataValue = Blob | boolean | number | string | null | undefined;
type FormDataFields = Record<string, FormDataValue>;

function normalizeCreatorCourses(
  response: CreatorCoursesApiResponse,
): Course[] {
  const courseData = "data" in response ? response.data : response;

  return Array.isArray(courseData) ? courseData : [courseData];
}

function appendFormDataFields(formData: FormData, fields: FormDataFields) {
  for (const key in fields) {
    const value = fields[key];

    if (value === null || value === undefined) {
      continue;
    }

    formData.append(key, value instanceof Blob ? value : String(value));
  }

  return formData;
}

export function buildCreateCourseFormData(course: CourseFormData) {
  const formData = new FormData();
  const modules = course.modules.map((module, moduleIndex) => ({
    title: module.title ?? "",
    lessons: (module.lessons ?? []).map((lesson, lessonIndex) => {
      if (lesson.video) {
        formData.append(`video_${moduleIndex}_${lessonIndex}`, lesson.video);
      }

      return {
        title: lesson.title ?? "",
        isFree: Boolean(lesson.isFree),
      };
    }),
  }));

  return appendFormDataFields(formData, {
    title: course.title,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    price: course.price,
    currency: course.currency,
    isFree: course.isFree,
    modules: JSON.stringify(modules),
    thumbnail: course.thumbnail,
  });
}

export function buildCoursePublishStatusFormData(isPublished: boolean) {
  return appendFormDataFields(new FormData(), { isPublished });
}

export const courseService = {
  async getCourses(role: UserRole) {
    if (role !== "instructor") {
      return [];
    }

    const response = await apiClient.get<CreatorCoursesApiResponse>(
      API_ENDPOINT_COURSE_GET_CREATOR,
    );

    return normalizeCreatorCourses(response.data);
  },

  async getCourseById(courseId: string) {
    const response = await apiClient.get<Course | { data: Course }>(
      `${API_ENDPOINT_COURSE_GET_BY_ID}/${courseId}`,
    );

    return "data" in response.data ? response.data.data : response.data;
  },

  async createCourse(course: CourseFormData) {
    try {
      const response = await apiClient.post<Course | { data: Course }>(
        API_ENDPOINT_COURSE_CREATE,
        buildCreateCourseFormData(course),
      );

      return "data" in response.data ? response.data.data : response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to create course.");
    }
  },

  async updateCourse(courseId: string, course: CourseFormData) {
    try {
      const response = await apiClient.put<Course | { data: Course }>(
        `${API_ENDPOINT_COURSE_EDIT}/${courseId}`,
        buildCreateCourseFormData(course),
      );

      return "data" in response.data ? response.data.data : response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to update course.");
    }
  },

  async updateCoursePublishStatus(courseId: string, isPublished: boolean) {
    try {
      const response = await apiClient.put<UpdateCourseStatusApiResponse>(
        `${API_ENDPOINT_COURSE_EDIT}/${courseId}`,
        buildCoursePublishStatusFormData(isPublished),
      );
      const responseBody = response.data;
      const course =
        "data" in responseBody
          ? responseBody.data
          : "title" in responseBody
            ? responseBody
            : undefined;
      const message =
        "message" in responseBody ? responseBody.message : undefined;

      return {
        courseId,
        course,
        isPublished,
        message:
          message ?? `Course ${isPublished ? "published" : "moved to draft"}.`,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to update course status.");
    }
  },

  async deleteCourse(courseId: string) {
    try {
      const response = await apiClient.delete<DeleteCourseApiResponse>(
        `${API_ENDPOINT_COURSE_REMOVE}/${courseId}`,
      );

      return {
        courseId,
        message: response.data.message ?? "Course removed",
      };
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to delete course.");
    }
  },
};
