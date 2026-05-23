import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Assessment } from "../../../types";
import type { AssessmentFormData } from "../services/assessmentService";
import { assessmentService } from "../services/assessmentService";

export interface AssessmentState {
  assessments: Assessment[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  createError: string | null;
}

const initialState: AssessmentState = {
  assessments: [],
  isLoading: false,
  isCreating: false,
  error: null,
  createError: null,
};

export const fetchAssessments = createAsyncThunk<Assessment[], string | undefined>(
  "assessments/fetchAssessments",
  async (courseId) => assessmentService.getAssessments(courseId),
);

export const createAssessment = createAsyncThunk<
  { assessment: Assessment; message: string },
  AssessmentFormData
>("assessments/createAssessment", async (assessment) =>
  assessmentService.createAssessment(assessment),
);

const assessmentSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
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
      });
  },
});

export const { clearCreateError } = assessmentSlice.actions;
export const assessmentReducer = assessmentSlice.reducer;
