import {
  BarChart3,
  BookMarked,
  ClipboardCheck,
  LayoutDashboard,
  Library,
  PlusCircle,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { MenuSection, UserRole } from '../types'

const roleMenus: Record<UserRole, MenuSection[]> = {
  student: [
    {
      title: 'Learning',
      items: [
        { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard, roles: ['student'] },
        { label: 'My Courses', path: 'my-courses', icon: BookMarked, roles: ['student'] },
        { label: 'Courses', path: 'courses', icon: Library, roles: ['student'] },
      ],
    },
  ],
  instructor: [
    {
      title: 'Workspace',
      items: [
        { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard, roles: ['instructor'] },
        { label: 'My Courses', path: 'courses', icon: BookMarked, roles: ['instructor'] },
        { label: 'Assessments', path: 'assessments', icon: ClipboardCheck, roles: ['instructor'] },
        { label: 'Create Course', path: 'create-course', icon: PlusCircle, roles: ['instructor'] },
        { label: 'Students', path: 'students', icon: Users, roles: ['instructor'] },
      ],
    },
  ],
  admin: [
    {
      title: 'Control Panel',
      items: [
        { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard, roles: ['admin'] },
        { label: 'User Management', path: 'users', icon: ShieldCheck, roles: ['admin'] },
        { label: 'Course Management', path: 'courses', icon: Library, roles: ['admin'] },
        { label: 'Reports', path: 'reports', icon: BarChart3, roles: ['admin'] },
      ],
    },
  ],
}

export function getMenuConfig(role: UserRole) {
  return roleMenus[role]
}
