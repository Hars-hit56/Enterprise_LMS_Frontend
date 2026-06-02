import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Course, CourseFormData, UserRole } from "../../../types";
import { courseService } from "../services/courseService";

export interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isPurchasing: boolean;
  error: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  purchaseError: string | null;
  loadedRole: UserRole | null;
}

const initialState: CourseState = {
  courses: [],
  selectedCourse: null,
  isLoading: false,
  isDetailLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isPurchasing: false,
  error: null,
  detailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  purchaseError: null,
  loadedRole: null,
};

export const fetchCourses = createAsyncThunk<Course[], UserRole>(
  "courses/fetchCourses",
  async (role) => courseService.getCourses(role),
  {
    condition: (role, { getState }) => {
      const state = getState() as { courses: CourseState };
      return !state.courses.isLoading || state.courses.loadedRole !== role;
    },
  },
);

export const fetchCourseById = createAsyncThunk<Course, string>(
  "courses/fetchCourseById",
  async (courseId) => courseService.getCourseById(courseId),
  {
    condition: (courseId, { getState }) => {
      const state = getState() as { courses: CourseState };
      return (
        !state.courses.isDetailLoading &&
        state.courses.selectedCourse?._id !== courseId
      );
    },
  },
);

export const createCourse = createAsyncThunk<Course, CourseFormData>(
  "courses/createCourse",
  async (course) => courseService.createCourse(course),
);

export const updateCourse = createAsyncThunk<
  Course,
  { courseId: string; course: CourseFormData }
>("courses/updateCourse", async ({ courseId, course }) =>
  courseService.updateCourse(courseId, course),
);

export const updateCoursePublishStatus = createAsyncThunk<
  {
    course?: Course;
    courseId: string;
    isPublished: boolean;
    message: string;
  },
  { courseId: string; isPublished: boolean; course: Course }
>("courses/updateCoursePublishStatus", async ({ courseId, isPublished, course }) =>
  courseService.updateCoursePublishStatus(courseId, isPublished, course),
);

export const deleteCourse = createAsyncThunk<
  { courseId: string; message: string },
  string
>(
  "courses/deleteCourse",
  async (courseId) => courseService.deleteCourse(courseId),
);

export const purchaseCourse = createAsyncThunk<
  {
    courseId: string;
    enrollmentId?: string;
    progress: number;
    message: string;
  },
  string
>("courses/purchaseCourse", async (courseId) =>
  courseService.purchaseCourse(courseId),
);

export const markLectureComplete = createAsyncThunk<
  {
    courseId: string;
    enrollmentId?: string;
    progress: number;
    completedLectures: string[];
  },
  { courseId: string; lectureId: string }
>("courses/markLectureComplete", async ({ courseId, lectureId }) =>
  courseService.completeLecture(courseId, lectureId),
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearPurchaseError: (state) => {
      state.purchaseError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loadedRole = action.meta.arg;
        state.isLoading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load courses.";
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.isDetailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.selectedCourse = action.payload;
        state.isDetailLoading = false;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError =
          action.error.message ?? "Failed to load course details.";
      })
      .addCase(createCourse.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
        state.selectedCourse = action.payload;
        state.isCreating = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.error.message ?? "Failed to create course.";
      })
      .addCase(updateCourse.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const updatedCourse = action.payload;
        state.courses = state.courses.map((course) =>
          (course._id ?? course.id) === (updatedCourse._id ?? updatedCourse.id)
            ? updatedCourse
            : course,
        );
        state.selectedCourse = updatedCourse;
        state.isUpdating = false;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.error.message ?? "Failed to update course.";
      })
      .addCase(updateCoursePublishStatus.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateCoursePublishStatus.fulfilled, (state, action) => {
        const {
          course: updatedCourse,
          courseId,
          isPublished,
        } = action.payload;
        state.courses = state.courses.map((course) => {
          if ((course._id ?? course.id) !== courseId) {
            return course;
          }

          return updatedCourse ?? { ...course, isPublished };
        });

        const selectedCourse = state.selectedCourse;
        if (selectedCourse && (selectedCourse._id ?? selectedCourse.id) === courseId) {
          state.selectedCourse =
            updatedCourse ?? { ...selectedCourse, isPublished };
        }

        state.isUpdating = false;
      })
      .addCase(updateCoursePublishStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError =
          action.error.message ?? "Failed to update course status.";
      })
      .addCase(deleteCourse.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        const deletedCourseId = action.payload.courseId;
        state.courses = state.courses.filter(
          (course) => (course._id ?? course.id) !== deletedCourseId,
        );
        if (
          (state.selectedCourse?._id ?? state.selectedCourse?.id) ===
          deletedCourseId
        ) {
          state.selectedCourse = null;
        }
        state.isDeleting = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.error.message ?? "Failed to delete course.";
      })
      .addCase(purchaseCourse.pending, (state) => {
        state.isPurchasing = true;
        state.purchaseError = null;
      })
      .addCase(purchaseCourse.fulfilled, (state, action) => {
        const { courseId, enrollmentId, progress } = action.payload;

        state.courses = state.courses.map((course) =>
          (course._id ?? course.id) === courseId
            ? {
                ...course,
                enrollmentId,
                progress,
                isEnrolled: true,
              }
            : course,
        );

        const selectedCourse = state.selectedCourse;
        if (
          selectedCourse &&
          (selectedCourse._id ?? selectedCourse.id) === courseId
        ) {
          state.selectedCourse = {
            ...selectedCourse,
            enrollmentId,
            progress,
            isEnrolled: true,
          };
        }

        state.isPurchasing = false;
      })
      .addCase(purchaseCourse.rejected, (state, action) => {
        state.isPurchasing = false;
        state.purchaseError =
          action.error.message ?? "Failed to purchase course.";
      })
      .addCase(markLectureComplete.fulfilled, (state, action) => {
        const { courseId, enrollmentId, progress } = action.payload;

        state.courses = state.courses.map((course) =>
          (course._id ?? course.id) === courseId
            ? {
                ...course,
                enrollmentId: enrollmentId ?? course.enrollmentId,
                progress,
              }
            : course,
        );

        const selectedCourse = state.selectedCourse;
        if (
          selectedCourse &&
          (selectedCourse._id ?? selectedCourse.id) === courseId
        ) {
          state.selectedCourse = {
            ...selectedCourse,
            enrollmentId: enrollmentId ?? selectedCourse.enrollmentId,
            progress,
          };
        }
      });
  },
});

export const {
  clearCreateError,
  clearDeleteError,
  clearPurchaseError,
  clearUpdateError,
} = courseSlice.actions;
export const courseReducer = courseSlice.reducer;
