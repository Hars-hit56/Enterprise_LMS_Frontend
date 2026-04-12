import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const login = useAuthStore((state) => state.login)
  const signup = useAuthStore((state) => state.signup)
  const logout = useAuthStore((state) => state.logout)

  return { user, isLoading, login, signup, logout }
}
