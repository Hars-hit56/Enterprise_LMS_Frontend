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
      title="Admin Dashboard"
      description="System overview and management across users, content, and operational health."
    >
      <div className="grid gap-5 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon ?? fallbackIcons[index]
          return <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
        })}
      </div>
      <div className="inline-flex rounded-2xl border border-line-100 bg-white p-1 shadow-soft">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === tab ? 'bg-soft text-ink-950' : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-line-100 px-6 py-5">
          <h2 className="text-2xl font-semibold text-ink-950">{activeTab}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-soft text-sm text-ink-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-line-100">
                  <td className="px-6 py-4 font-semibold text-ink-950">{user.name}</td>
                  <td className="px-6 py-4 text-ink-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge tone={user.role === 'admin' ? 'warning' : user.role === 'instructor' ? 'brand' : 'neutral'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone="success">{user.status ?? 'Active'}</Badge>
                  </td>
                  <td className="px-6 py-4 text-ink-500">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardSection>
  )
}
