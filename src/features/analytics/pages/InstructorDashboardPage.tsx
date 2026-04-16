import { BookOpen, TrendingUp, Users } from "lucide-react";
import { DataTable } from "../../../components/common/DataTable";
import { RowActions } from "../../../components/common/RowActions";
import { StatCard } from "../../../components/common/StatCard";
import { Badge } from "../../../components/ui/Badge";
import type { Course, TableColumn } from "../../../types";
import { useCourses } from "../../courses/hooks/useCourses";
import { DashboardSection } from "../components/DashboardSection";
import { useInstructorAnalytics } from "../hooks/useAnalytics";

const fallbackIcons = [Users, BookOpen, TrendingUp];

const columns: TableColumn<Course>[] = [
  { key: "title", header: "Course" },
  { key: "instructor", header: "Instructor" },
  {
    key: "status",
    header: "Status",
    render: (course) => (
      <Badge tone={course.status === "Published" ? "success" : "warning"}>
        {course.status}
      </Badge>
    ),
  },
  { key: "students", header: "Students" },
  { key: "rating", header: "Rating" },
  { key: "price", header: "Revenue" },
];

export function InstructorDashboardPage() {
  const stats = useInstructorAnalytics();
  const { courses } = useCourses("instructor");

  return (
    <DashboardSection
      title="Instructor overview"
      description="Track course health, learner momentum, and the next teaching priorities."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon ?? fallbackIcons[index];
          return (
            <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
          );
        })}
      </div>
      <div className="">
        {/* <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-ink-950">
              Course performance
            </h2>
            <p className="mt-1.5 text-sm text-ink-500">
              Review active cohorts and progress trends.
            </p>
          </div> */}
        {/* <CourseGrid courses={courses.slice(0, 2)} /> */}
        <DataTable
          title="Your Courses"
          rows={courses}
          columns={columns}
          searchKey={(course) => `${course.title} ${course.instructor}`}
        />
        {/* </Card> */}
      </div>
    </DashboardSection>
  );
}
