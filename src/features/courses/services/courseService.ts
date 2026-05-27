import type { Course, CourseFormData, UserRole } from "../../../types";
import { apiClient } from "../../../services/apiClient";
import {
  API_ENDPOINT_COURSE_ADMIN_COURSES,
  API_ENDPOINT_COURSE_CREATE,
  API_ENDPOINT_COURSE_EDIT,
  API_ENDPOINT_COURSE_GET_BY_ID,
  API_ENDPOINT_COURSE_GET_CREATOR,
  API_ENDPOINT_COURSE_GET_PUBLISHED,
  API_ENDPOINT_COURSE_REMOVE,
  API_ENDPOINT_ENROLLMENT,
  API_ENDPOINT_ENROLLMENT_MY,
} from "../../../services/apiTypes";
import type { AxiosError } from "axios";

type CreatorCoursesApiResponse =
  | Course
  | Course[]
  | { data: Course | Course[] };

type AdminCoursesApiResponse =
  | Course[]
  | {
      success?: boolean;
      totalCourses?: number;
      courses?: Course[];
      data?: Course[];
    };

type CourseDetailApiResponse =
  | Course
  | {
      course: Course;
      isEnrolled?: boolean;
    }
  | {
      data: Course;
      isEnrolled?: boolean;
    };

type DeleteCourseApiResponse = {
  message?: string;
};

type UpdateCourseStatusApiResponse =
  | Course
  | {
      data?: Course;
      message?: string;
    };

interface Enrollment {
  _id?: string;
  id?: string;
  courseId: Course | string;
  progress?: number;
}

type EnrollmentsApiResponse =
  | Enrollment[]
  | {
      data?: Enrollment[];
    };

type PurchaseCourseApiResponse = {
  message?: string;
  enrollment?: Enrollment;
};

type FormDataValue = Blob | boolean | number | string | null | undefined;
type FormDataFields = Record<string, FormDataValue>;

function normalizeCreatorCourses(
  response: CreatorCoursesApiResponse,
): Course[] {
  const courseData = "data" in response ? response.data : response;

  return Array.isArray(courseData) ? courseData : [courseData];
}

function normalizeAdminCourses(response: AdminCoursesApiResponse): Course[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response.courses ?? response.data ?? [];
}

function normalizeEnrollments(response: EnrollmentsApiResponse): Enrollment[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? [];
}

function normalizeCourseDetail(response: CourseDetailApiResponse): Course {
  if ("course" in response) {
    return {
      ...response.course,
      isEnrolled: response.isEnrolled ?? response.course.isEnrolled,
    };
  }

  if ("data" in response) {
    return {
      ...response.data,
      isEnrolled: response.isEnrolled ?? response.data.isEnrolled,
    };
  }

  return response;
}

function getCourseLessonCount(course: Course) {
  return (
    course.modules?.reduce(
      (total, module) =>
        total + (module.lectures?.length ?? module.lessons?.length ?? 0),
      0,
    ) ?? 0
  );
}

function getCourseRating(course: Course) {
  const reviewRatings = course.reviews
    ?.map((review) =>
      typeof review === "object" && review && "rating" in review
        ? Number(review.rating)
        : Number.NaN,
    )
    .filter(Number.isFinite);

  if (!reviewRatings?.length) {
    return course.rating ?? 0;
  }

  return (
    Math.round(
      (reviewRatings.reduce((total, rating) => total + rating, 0) /
        reviewRatings.length) *
        10,
    ) / 10
  );
}

function mapApiCourse(course: Course): Course {
  const id = course._id ?? course.id ?? "";
  const lessons = course.lessons ?? getCourseLessonCount(course);
  const enrolledStudents = course.enrolledStudents ?? [];
  const instructor = course?.creator?.name;
  const title = course.title ?? course.course ?? "";

  return {
    ...course,
    id,
    title,
    instructor: instructor,
    duration: `${lessons} lessons`,
    students: course.students ?? enrolledStudents.length,
    rating: getCourseRating(course),
    thumbnail: course.thumbnail ?? title.charAt(0).toUpperCase(),
  };
}

function mapEnrollmentCourse(enrollment: Enrollment): Course | null {
  if (typeof enrollment.courseId === "string") {
    return null;
  }

  return {
    ...mapApiCourse(enrollment.courseId),
    enrollmentId: enrollment._id ?? enrollment.id,
    progress: enrollment.progress ?? 0,
    isEnrolled: true,
  };
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
    _id: module._id,
    id: module.id,
    title: module.title ?? "",
    lessons: (module.lessons ?? []).map((lesson, lessonIndex) => {
      if (lesson.video) {
        formData.append(`video_${moduleIndex}_${lessonIndex}`, lesson.video);
      }

      return {
        _id: lesson._id,
        id: lesson.id,
        title: lesson.title ?? "",
        isFree: Boolean(lesson.isFree),
        videoUrl: lesson.videoUrl ?? null,
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
    isPublished: course.isPublished,
    modules: JSON.stringify(modules),
    thumbnail: course.thumbnail,
  });
}

function buildCourseFormDataFromCourse(
  course: Course,
  isPublished: boolean,
): CourseFormData {
  return {
    title: course.title,
    description: course.description ?? "",
    category: course.category,
    difficulty: course.difficulty ?? course.level ?? "",
    price: String(course.price ?? ""),
    currency: course.currency ?? "INR",
    isFree: Boolean(course.isFree),
    isPublished,
    thumbnail: null,
    thumbnailPreview: course.thumbnail ?? "",
    modules: (course.modules ?? []).map((module, moduleIndex) => ({
      ...module,
      id: module.id ?? module._id ?? `module-${moduleIndex}`,
      title: module.title ?? module.moduleTitle ?? "",
      lessons: (module.lessons ?? module.lectures ?? []).map(
        (lesson, lessonIndex) => {
          if (typeof lesson === "string") {
            return {
              id: lesson,
              title: "",
              isFree: false,
            };
          }

          return {
            ...lesson,
            id:
              lesson.id ?? lesson._id ?? `lesson-${moduleIndex}-${lessonIndex}`,
            title: lesson.title ?? lesson.lectureTitle ?? "",
            isFree: lesson.isFree ?? lesson.isPreviewFree ?? false,
          };
        },
      ),
    })),
  };
}

export const courseService = {
  async getCourses(role: UserRole) {
    if (role === "admin") {
      const response = await apiClient.get<AdminCoursesApiResponse>(
        API_ENDPOINT_COURSE_ADMIN_COURSES,
      );

      return normalizeAdminCourses(response.data).map(mapApiCourse);
    }

    if (role === "student") {
      const response = await apiClient.get<Course[]>(
        API_ENDPOINT_COURSE_GET_PUBLISHED,
      );
      return response.data.map(mapApiCourse);
    }

    const response = await apiClient.get<CreatorCoursesApiResponse>(
      API_ENDPOINT_COURSE_GET_CREATOR,
    );

    return normalizeCreatorCourses(response.data).map(mapApiCourse);
  },

  async getMyCourses() {
    const response = await apiClient.get<EnrollmentsApiResponse>(
      API_ENDPOINT_ENROLLMENT_MY,
    );

    return normalizeEnrollments(response.data)
      .map(mapEnrollmentCourse)
      .filter((course): course is Course => Boolean(course));
  },

  async getCourseById(courseId: string) {
    const response = await apiClient.get<CourseDetailApiResponse>(
      `${API_ENDPOINT_COURSE_GET_BY_ID}/${courseId}`,
    );

    return mapApiCourse(normalizeCourseDetail(response.data));
  },

  async purchaseCourse(courseId: string) {
    try {
      const response = await apiClient.post<PurchaseCourseApiResponse>(
        `${API_ENDPOINT_ENROLLMENT}/${courseId}`,
      );
      const enrollment = response.data.enrollment;

      return {
        courseId:
          typeof enrollment?.courseId === "string"
            ? enrollment.courseId
            : courseId,
        enrollmentId: enrollment?._id ?? enrollment?.id,
        progress: enrollment?.progress ?? 0,
        message: response.data.message ?? "Course purchase successfully",
      };
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ?? axiosError.response?.data?.error;

      throw new Error(message ?? "Failed to purchase course.");
    }
  },

  async createCourse(course: CourseFormData) {
    try {
      const response = await apiClient.post<Course | { data: Course }>(
        API_ENDPOINT_COURSE_CREATE,
        buildCreateCourseFormData(course),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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

  async updateCoursePublishStatus(
    courseId: string,
    isPublished: boolean,
    course: Course,
  ) {
    try {
      const fullCourse = await courseService.getCourseById(courseId);
      const response = await apiClient.put<UpdateCourseStatusApiResponse>(
        `${API_ENDPOINT_COURSE_EDIT}/${courseId}`,
        buildCreateCourseFormData(
          buildCourseFormDataFromCourse(
            {
              ...course,
              ...fullCourse,
            },
            isPublished,
          ),
        ),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const responseBody = response.data;
      const updatedCourse =
        "data" in responseBody
          ? responseBody.data && mapApiCourse(responseBody.data)
          : "title" in responseBody
            ? mapApiCourse(responseBody)
            : undefined;
      const message =
        "message" in responseBody ? responseBody.message : undefined;

      return {
        courseId,
        course: updatedCourse,
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
