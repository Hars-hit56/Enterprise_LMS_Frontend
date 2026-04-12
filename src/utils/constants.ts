import type { UserRole } from '../types'

export const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Admin',
}

export const roleHomePaths: Record<UserRole, string> = {
  student: '/student/dashboard',
  instructor: '/instructor/dashboard',
  admin: '/admin/dashboard',
}

export const userRegistryStorageKey = 'learnhub-user-registry'
