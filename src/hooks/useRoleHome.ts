import { roleHomePaths } from '../utils/constants'
import type { UserRole } from '../types'

export function useRoleHome(role: UserRole) {
  return roleHomePaths[role]
}
