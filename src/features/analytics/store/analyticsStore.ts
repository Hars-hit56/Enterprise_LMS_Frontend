import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { analyticsService } from "../services/analyticsService";
import type {
  AdminAnalyticsResponse,
  InstructorAnalyticsResponse,
  StudentAnalyticsResponse,
} from "../services/analyticsService";

export interface AnalyticsState {
  admin: AdminAnalyticsResponse | null;
  instructor: InstructorAnalyticsResponse | null;
  student: StudentAnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  admin: null,
  instructor: null,
  student: null,
  isLoading: false,
  error: null,
};

export const fetchInstructorAnalytics = createAsyncThunk<
  InstructorAnalyticsResponse
>(
  "analytics/fetchInstructorAnalytics",
  async () => analyticsService.getInstructorAnalytics(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { analytics: AnalyticsState };
      return !state.analytics.isLoading;
    },
  },
);

export const fetchAdminAnalytics = createAsyncThunk<AdminAnalyticsResponse>(
  "analytics/fetchAdminAnalytics",
  async () => analyticsService.getAdminAnalytics(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { analytics: AnalyticsState };
      return !state.analytics.isLoading;
    },
  },
);

export const fetchStudentAnalytics = createAsyncThunk<StudentAnalyticsResponse>(
  "analytics/fetchStudentAnalytics",
  async () => analyticsService.getStudentAnalytics(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { analytics: AnalyticsState };
      return !state.analytics.isLoading;
    },
  },
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructorAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructorAnalytics.fulfilled, (state, action) => {
        state.instructor = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInstructorAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? "Failed to load instructor analytics.";
      })
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load admin analytics.";
      })
      .addCase(fetchStudentAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentAnalytics.fulfilled, (state, action) => {
        state.student = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchStudentAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? "Failed to load student analytics.";
      });
  },
});

export const analyticsReducer = analyticsSlice.reducer;
