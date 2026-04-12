import { BookOpen, Sparkles, TrendingUp } from 'lucide-react'
import { StatCard } from '../../../components/common/StatCard'
import { Card } from '../../../components/ui/Card'
import { AssessmentList } from '../../assessments/components/AssessmentList'
import { useAssessments } from '../../assessments/hooks/useAssessments'
import { CourseGrid } from '../../courses/components/CourseGrid'
import { useCourses } from '../../courses/hooks/useCourses'
import { DashboardSection } from '../components/DashboardSection'
import { useStudentAnalytics } from '../hooks/useAnalytics'

const fallbackIcons = [Sparkles, BookOpen, TrendingUp]

export function StudentDashboardPage() {
  const stats = useStudentAnalytics()
  const { courses } = useCourses('student')
  const { assessments } = useAssessments()

  return (
    <DashboardSection
      title="Student Dashboard"
      description="Your learning pipeline, milestones, and upcoming work at a glance."
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon ?? fallbackIcons[index]
          return <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
        })}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-ink-950">Recommended courses</h2>
            <p className="mt-2 text-sm text-ink-500">Personalized picks based on your current path.</p>
          </div>
          <CourseGrid courses={courses.slice(0, 2)} />
        </Card>
        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-ink-950">Upcoming assessments</h2>
            <p className="mt-2 text-sm text-ink-500">Stay ahead of due dates and feedback windows.</p>
          </div>
          <AssessmentList assessments={assessments.slice(0, 2)} />
        </Card>
      </div>
    </DashboardSection>
  )
}
