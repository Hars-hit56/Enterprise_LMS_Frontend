import { useState } from 'react'
import { CircleAlert, GraduationCap, TrendingUp, Users } from 'lucide-react'
import { StatCard } from '../../../components/common/StatCard'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { useUsers } from '../../users/hooks/useUsers'
import { DashboardSection } from '../components/DashboardSection'
import { useAdminAnalytics } from '../hooks/useAnalytics'

const tabs = ['User Management', 'Course Management', 'Reports'] as const
const fallbackIcons = [Users, GraduationCap, TrendingUp, CircleAlert]

export function AdminDashboardPage() {
  const stats = useAdminAnalytics()
  const { users } = useUsers()
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('User Management')

  return (
    <DashboardSection
      title="Admin overview"
      description="A compact system view across users, courses, reports, and operational health."
    >
      <div className="grid gap-4 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon ?? fallbackIcons[index]
          return <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
        })}
      </div>
      <div className="inline-flex flex-wrap rounded-xl border border-line-100 bg-white p-1 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              activeTab === tab ? 'bg-soft text-ink-950' : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-line-100 px-5 py-4">
          <h2 className="text-lg font-medium text-ink-950">{activeTab}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-soft text-sm text-ink-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Role</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-line-100">
                  <td className="px-5 py-3.5 font-medium text-ink-950">{user.name}</td>
                  <td className="px-5 py-3.5 text-ink-500">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={user.role === 'admin' ? 'warning' : user.role === 'instructor' ? 'brand' : 'neutral'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone="success">{user.status ?? 'Active'}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-ink-500">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardSection>
  )
}
