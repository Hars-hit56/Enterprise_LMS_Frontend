import type { User } from '../../../types'
import { authService } from '../../auth/services/authService'

export const userService = {
  async getUsers(): Promise<User[]> {
    return authService.getUsers()
  },
}
