import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../../types";
import { userService } from "../services/userService";
import type { AdminUpdateUserPayload } from "../services/userService";
import type { InstructorUpdateUserPayload } from "../services/userService";

export interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => userService.getUsers(),
);

export const fetchInstructorStudents = createAsyncThunk<User[]>(
  "users/fetchInstructorStudents",
  async () => userService.getInstructorStudents(),
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; updates: AdminUpdateUserPayload }
>("users/updateUser", async ({ id, updates }) =>
  userService.updateUser(id, updates),
);

export const updateInstructorUser = createAsyncThunk<
  User,
  { id: string; updates: InstructorUpdateUserPayload }
>("users/updateInstructorUser", async ({ id, updates }) =>
  userService.updateInstructorUser(id, updates),
);

export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id) => {
    await userService.deleteUser(id);
    return id;
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load users.";
      })
      .addCase(fetchInstructorStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructorStudents.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInstructorStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load students.";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
        );
      })
      .addCase(updateInstructorUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export const userReducer = userSlice.reducer;
