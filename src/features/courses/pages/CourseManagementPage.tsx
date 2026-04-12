import { DataTable } from '../../../components/common/DataTable'
import { Badge } from '../../../components/ui/Badge'
import type { Course, TableColumn } from '../../../types'
import { useCourses } from '../hooks/useCourses'

const columns: TableColumn<Course>[] = [
  { key: 'title', header: 'Course' },
  { key: 'instructor', header: 'Instructor' },
  {
    key: 'status',
    header: 'Status',
    render: (course) => (
      <Badge tone={course.status === 'Published' ? 'success' : 'warning'}>{course.status}</Badge>
    ),
  },
  { key: 'students', header: 'Students' },
  { key: 'rating', header: 'Rating' },
]

export function CourseManagementPage() {
  const { courses } = useCourses('admin')

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink-950">Course Management</h1>
        <p className="mt-2 text-base text-ink-500">
          Review publishing status, enrollment load, and instructor ownership.
        </p>
      </div>
      <DataTable
        title="Course portfolio"
        rows={courses}
        columns={columns}
        searchKey={(course) => `${course.title} ${course.instructor}`}
      />
    </section>
  )
}
