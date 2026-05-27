import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Assessment } from "../../../types";
import type { AssessmentFormData } from "../services/assessmentService";
import { assessmentService } from "../services/assessmentService";

export interface AssessmentState {
  assessments: Assessment[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: AssessmentState = {
  assessments: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const fetchAssessments = createAsyncThunk<Assessment[], string | undefined>(
  "assessments/fetchAssessments",
  async (courseId) => assessmentService.getAssessments(courseId),
);

export const fetchInstructorCourseAssessments = createAsyncThunk<
  Assessment[],
  string
>("assessments/fetchInstructorCourseAssessments", async (courseId) =>
  assessmentService.getInstructorCourseAssessments(courseId),
);

export const createAssessment = createAsyncThunk<
  { assessment: Assessment; message: string },
  AssessmentFormData
>("assessments/createAssessment", async (assessment) =>
  assessmentService.createAssessment(assessment),
);

export const updateAssessment = createAsyncThunk<
  { assessment: Assessment; message: string },
  { assessmentId: string; assessment: AssessmentFormData }
>("assessments/updateAssessment", async ({ assessmentId, assessment }) =>
  assessmentService.updateAssessment(assessmentId, assessment),
);

export const deleteAssessment = createAsyncThunk<string, string>(
  "assessments/deleteAssessment",
  async (assessmentId) => {
    await assessmentService.deleteAssessment(assessmentId);
    return assessmentId;
  },
);

const assessmentSlice = createSlice({
  name: "assessments",
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.assessments = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load assessments.";
      })
      .addCase(fetchInstructorCourseAssessments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructorCourseAssessments.fulfilled, (state, action) => {
        state.assessments = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInstructorCourseAssessments.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? "Failed to load course assessments.";
      })
      .addCase(createAssessment.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.assessments.unshift(action.payload.assessment);
        state.isCreating = false;
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.isCreating = false;
        state.createError =
          action.error.message ?? "Failed to create assessment.";
      })
      .addCase(updateAssessment.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateAssessment.fulfilled, (state, action) => {
        const updatedAssessment = action.payload.assessment;
        state.assessments = state.assessments.map((assessment) =>
          assessment.id === updatedAssessment.id
            ? updatedAssessment
            : assessment,
        );
        state.isUpdating = false;
      })
      .addCase(updateAssessment.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError =
          action.error.message ?? "Failed to update assessment.";
      })
      .addCase(deleteAssessment.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.assessments = state.assessments.filter(
          (assessment) => assessment.id !== action.payload,
        );
        state.isDeleting = false;
      })
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError =
          action.error.message ?? "Failed to delete assessment.";
      });
  },
});

export const { clearCreateError, clearDeleteError, clearUpdateError } =
  assessmentSlice.actions;
export const assessmentReducer = assessmentSlice.reducer;
