import { configureStore } from '@reduxjs/toolkit'
import { analyticsReducer } from '../features/analytics/store/analyticsStore'
import { authReducer } from '../features/auth/store/authStore'
import { courseReducer } from '../features/courses/store/courseStore'

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    auth: authReducer,
    courses: courseReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
