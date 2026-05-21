import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { analyticsService } from "../services/analyticsService";
import type { InstructorAnalyticsResponse } from "../services/analyticsService";

export interface AnalyticsState {
  instructor: InstructorAnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  instructor: null,
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
      });
  },
});

export const analyticsReducer = analyticsSlice.reducer;
