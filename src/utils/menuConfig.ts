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
import type { MenuSection } from '../types'

export const menuConfig: MenuSection[] = [
  {
    title: 'Learning',
    items: [
      { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard, roles: ['student', 'instructor', 'admin'] },
      { label: 'My Courses', path: 'courses', icon: BookMarked, roles: ['student', 'instructor'] },
      { label: 'Assessments', path: 'assessments', icon: ClipboardCheck, roles: ['student', 'instructor'] },
    ],
  },
  {
    title: 'Teaching',
    items: [
      { label: 'Create Course', path: 'create-course', icon: PlusCircle, roles: ['instructor'] },
      { label: 'Students', path: 'students', icon: Users, roles: ['instructor'] },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'User Management', path: 'users', icon: ShieldCheck, roles: ['admin'] },
      { label: 'Course Management', path: 'courses', icon: Library, roles: ['admin'] },
      { label: 'Reports', path: 'reports', icon: BarChart3, roles: ['admin'] },
    ],
  },
]
