import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { DataTable } from "../../../components/common/DataTable";
import { RowActions } from "../../../components/common/RowActions";
import { StatCard } from "../../../components/common/StatCard";
import { Badge } from "../../../components/ui/Badge";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCourses } from "../hooks/useCourses";
import { useCourseStats } from "../hooks/useCourseStats";
import type { Course, UserRole } from "../../../types";

// const columns: TableColumn<Course>[] = [
//   { key: "title", header: "Course" },
//   { key: "instructor", header: "Instructor" },
//   {
//     key: "status",
//     header: "Status",
//     render: (course) => (
//       <Badge tone={course.status === "Published" ? "success" : "warning"}>
//         {course.status}
//       </Badge>
//     ),
//   },
//   { key: "students", header: "Students" },
//   { key: "rating", header: "Rating" },
// ];
const getColumns = (role: UserRole, onEditCourse: (course: Course) => void) => {
  const baseColumns = [
    { key: "title", header: "Course" },

    {
      key: "status",
      header: "Status",
      render: (course: Course) => (
        <Badge tone={course.status === "Published" ? "success" : "warning"}>
          {course.status}
        </Badge>
      ),
    },

    { key: "students", header: "Students" },
    { key: "rating", header: "Rating" },
    { key: "price", header: "Revenue" },
    {
      key: "actions",
      header: "",
      render: (course: Course) => (
        <RowActions
          onEdit={() => onEditCourse(course)}
          onDelete={() => console.log("Delete course", course)}
          editLabel="Edit Course"
          deleteLabel="Delete"
        />
      ),
    },
  ];

  if (role === "admin") {
    baseColumns.splice(1, 0, {
      key: "instructor",
      header: "Instructor",
    });
  }

  return baseColumns;
};

export function CourseManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const { courses } = useCourses(user.role);
  const stats = useCourseStats();

  const columns = getColumns(user.role, (course) => {
    navigate(`edit/${course.id}`);
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
          My Content
        </h1>
        <p className="mt-1 max-w-2xl text-[12px] text-ink-500">
          Manage your courses, lessons, and assessments
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate("create")}>Create Course</Button>
        <Button
          variant="secondary"
          onClick={() => navigate("../assessments/create")}
        >
          Create Assessment
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
          );
        })}
      </div>
      <DataTable
        title="Course portfolio"
        rows={courses}
        columns={columns}
        searchKey={(course) => `${course.title} ${course.instructor}`}
      />
    </section>
  );
}
