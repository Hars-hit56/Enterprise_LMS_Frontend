import { useEffect } from 'react'
import { useUserStore } from '../store/userStore'

export function useUsers() {
  const users = useUserStore((state) => state.users)
  const isLoading = useUserStore((state) => state.isLoading)
  const fetchUsers = useUserStore((state) => state.fetchUsers)

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  return { users, isLoading }
}
