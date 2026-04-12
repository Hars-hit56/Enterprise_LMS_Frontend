import { Activity, BookOpen, CircleAlert, GraduationCap, TrendingUp, Users } from 'lucide-react'
import type { ElementType } from 'react'
import type { DashboardStat } from '../../../types'
import { mockApi } from '../../../services/mockApi'

export type StatWithIcon = DashboardStat & { icon: ElementType }

export const analyticsService = {
  async getStudentStats() {
    const stats: StatWithIcon[] = [
      { id: '1', label: 'Learning Streak', value: '16 days', delta: '+4 vs last month', tone: 'brand', icon: Activity },
      { id: '2', label: 'Courses Active', value: '6', delta: '2 certifications in progress', tone: 'success', icon: BookOpen },
      { id: '3', label: 'Average Score', value: '91%', delta: '+8% since last quarter', tone: 'warning', icon: TrendingUp },
    ]

    return mockApi(stats)
  },

  async getInstructorStats() {
    const stats: StatWithIcon[] = [
      { id: '1', label: 'Students Reached', value: '1,248', delta: '+82 this week', tone: 'brand', icon: Users },
      { id: '2', label: 'Courses Published', value: '14', delta: '3 awaiting review', tone: 'success', icon: BookOpen },
      { id: '3', label: 'Completion Rate', value: '72%', delta: '+5% vs last cohort', tone: 'warning', icon: TrendingUp },
    ]

    return mockApi(stats)
  },

  async getAdminStats() {
    const stats: StatWithIcon[] = [
      { id: '1', label: 'Total Users', value: '10,482', delta: '+128 this week', tone: 'brand', icon: Users },
      { id: '2', label: 'Active Courses', value: '342', delta: '+12 new', tone: 'success', icon: GraduationCap },
      { id: '3', label: 'Completion Rate', value: '68%', delta: '+3% vs last month', tone: 'warning', icon: TrendingUp },
      { id: '4', label: 'Issues', value: '3', delta: '2 critical', tone: 'danger', icon: CircleAlert },
    ]

    return mockApi(stats)
  },
}
