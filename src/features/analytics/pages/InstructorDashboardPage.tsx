import { BookOpen, TrendingUp, Users } from 'lucide-react'
import { StatCard } from '../../../components/common/StatCard'
import { Card } from '../../../components/ui/Card'
import { CourseGrid } from '../../courses/components/CourseGrid'
import { useCourses } from '../../courses/hooks/useCourses'
import { DashboardSection } from '../components/DashboardSection'
import { useInstructorAnalytics } from '../hooks/useAnalytics'

const fallbackIcons = [Users, BookOpen, TrendingUp]

export function InstructorDashboardPage() {
  const stats = useInstructorAnalytics()
  const { courses } = useCourses('instructor')

  return (
    <DashboardSection
      title="Instructor overview"
      description="Track course health, learner momentum, and the next teaching priorities."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon ?? fallbackIcons[index]
          return <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-ink-950">Course performance</h2>
            <p className="mt-1.5 text-sm text-ink-500">Review active cohorts and progress trends.</p>
          </div>
          <CourseGrid courses={courses.slice(0, 2)} />
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-medium text-ink-950">Workflow focus</h2>
          <div className="rounded-xl border border-line-100 bg-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Content review queue</p>
            <p className="mt-2 text-xl font-medium text-ink-950">3 courses</p>
            <p className="mt-2 text-sm text-ink-500">Need final review before publishing this week.</p>
          </div>
          <div className="rounded-xl border border-line-100 bg-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Student support tickets</p>
            <p className="mt-2 text-xl font-medium text-ink-950">18 open</p>
            <p className="mt-2 text-sm text-ink-500">Average response time is 2.1 hours.</p>
          </div>
        </Card>
      </div>
    </DashboardSection>
  )
}
