import { Star } from 'lucide-react'
import type { Course } from '../../../types'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {courses.map((course) => (
        <Card key={course.id} className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-600">{course.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink-950">{course.title}</h3>
              <p className="mt-2 text-sm text-ink-500">Instructor: {course.instructor}</p>
            </div>
            <Badge tone={course.status === 'Published' ? 'success' : 'warning'}>
              {course.status}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-ink-500">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-line-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-ink-500">
            <span>{course.lessons} lessons</span>
            <span>{course.students} students</span>
            <span className="inline-flex items-center gap-1 font-semibold text-ink-700">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {course.rating}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
