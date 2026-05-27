import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { UserRole } from '../../../types'
import type { AuthUser } from '../services/authService'
import { authService } from '../services/authService'
import type { LogoutResponse } from '../services/authService'
import type { UpdateProfilePayload } from '../services/authService'

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  error: string | null
  successMessage: string | null
}

interface LoginPayload {
  email: string
  password: string
}

interface SignupPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

interface AuthResult {
  user: AuthUser
  token: string | null
  message?: string
}

export const loginUser = createAsyncThunk<AuthResult, LoginPayload>(
  'auth/login',
  async ({ email, password }) => authService.login(email, password),
  {
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState }
      return !state.auth.isLoading
    },
  },
)

export const signupUser = createAsyncThunk<AuthResult, SignupPayload>(
  'auth/signup',
  async (payload) => authService.signup(payload),
  {
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState }
      return !state.auth.isLoading
    },
  },
)

export const logoutUser = createAsyncThunk<LogoutResponse>(
  'auth/logout',
  async () => authService.logout(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState }
      return !state.auth.isLoading
    },
  },
)

export const updateProfile = createAsyncThunk<
  { user: AuthUser; message: string },
  UpdateProfilePayload
>(
  'auth/updateProfile',
  async (payload) => authService.updateProfile(payload),
  {
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState }
      return !state.auth.isLoading
    },
  },
)

export const fetchCurrentUser = createAsyncThunk<AuthUser>(
  'auth/fetchCurrentUser',
  async () => authService.getCurrentUser(),
  {
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState }
      return Boolean(state.auth.token) && !state.auth.isLoading
    },
  },
)

const initialState: AuthState = {
  user: authService.getUser(),
  token: authService.getToken(),
  isLoading: false,
  error: null,
  successMessage: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessage(state) {
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isLoading = false
        state.successMessage = action.payload.message ?? null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Login failed.'
        state.successMessage = null
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isLoading = false
        state.successMessage = action.payload.message ?? null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Signup failed.'
        state.successMessage = null
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null
        state.token = null
        state.isLoading = false
        state.successMessage = action.payload.message
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null
        state.token = null
        state.isLoading = false
        state.error = action.error.message ?? null
        state.successMessage = null
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isLoading = false
        state.successMessage = action.payload.message
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to update profile.'
        state.successMessage = null
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to load current user.'
      })
  },
})

export const { clearAuthMessage } = authSlice.actions
export const authReducer = authSlice.reducer
