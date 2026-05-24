import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { analyticsReducer } from '../features/analytics/store/analyticsStore'
import { assessmentReducer } from '../features/assessments/store/assessmentStore'
import { authReducer } from '../features/auth/store/authStore'
import { logoutUser } from '../features/auth/store/authStore'
import { courseReducer } from '../features/courses/store/courseStore'

const appReducer = combineReducers({
  analytics: analyticsReducer,
  assessments: assessmentReducer,
  auth: authReducer,
  courses: courseReducer,
})

const rootReducer: typeof appReducer = (state, action) => {
  if (
    logoutUser.fulfilled.match(action) ||
    logoutUser.rejected.match(action)
  ) {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
