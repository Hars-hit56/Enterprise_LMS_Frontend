import { EmptyState } from '../../../components/common/EmptyState'
import { useAuth } from '../../auth/hooks/useAuth'
import { CourseGrid } from '../components/CourseGrid'
import { useCourses } from '../hooks/useCourses'

export function MyCoursesPage() {
  const { user } = useAuth()
  const role = user?.role ?? 'student'
  const { courses, isLoading } = useCourses(role)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink-950">My Courses</h1>
        <p className="mt-2 text-base text-ink-500">
          Track active enrollments, monitor progress, and spot content needing attention.
        </p>
      </div>
      {isLoading ? (
        <EmptyState title="Loading courses" description="Fetching your course catalog and current progress." />
      ) : (
        <CourseGrid courses={courses} />
      )}
    </section>
  )
}
