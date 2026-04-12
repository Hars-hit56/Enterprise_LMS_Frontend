import type { Course, UserRole } from '../../../types'
import { mockApi } from '../../../services/mockApi'

const courses: Course[] = [
  { id: 'c-101', title: 'Design Systems for Product Teams', category: 'Design', instructor: 'Sarah Chen', progress: 78, lessons: 24, status: 'Published', students: 230, rating: 4.8 },
  { id: 'c-102', title: 'React Architecture at Scale', category: 'Development', instructor: 'Sarah Chen', progress: 52, lessons: 18, status: 'Published', students: 184, rating: 4.9 },
  { id: 'c-103', title: 'Data Visualization Essentials', category: 'Analytics', instructor: 'Marcus Lee', progress: 32, lessons: 15, status: 'Review', students: 96, rating: 4.6 },
  { id: 'c-104', title: 'Leadership Communication', category: 'Business', instructor: 'Amelia Brooks', progress: 91, lessons: 12, status: 'Draft', students: 64, rating: 4.7 },
]

export const courseService = {
  async getCourses(role: UserRole) {
    if (role === 'admin') {
      return mockApi(courses)
    }

    return mockApi(courses.filter((course) => course.status !== 'Draft'))
  },
}
