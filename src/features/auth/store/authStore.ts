import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../../../types'
import { authService } from '../services/authService'

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (payload: {
    name: string
    email: string
    password: string
    role: User['role']
  }) => Promise<User>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const user = await authService.login(email, password)
          set({ user, isLoading: false })
          return user
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      signup: async (payload) => {
        set({ isLoading: true })
        try {
          const user = await authService.signup(payload)
          set({ user, isLoading: false })
          return user
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      logout: () => set({ user: null }),
    }),
    { name: 'learnhub-auth' },
  ),
)
