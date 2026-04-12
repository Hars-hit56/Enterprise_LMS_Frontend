import { create } from 'zustand'
import type { User } from '../../../types'
import { userService } from '../services/userService'

interface UserState {
  users: User[]
  isLoading: boolean
  fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true })
    const users = await userService.getUsers()
    set({ users, isLoading: false })
  },
}))
