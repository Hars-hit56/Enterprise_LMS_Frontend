import { DataTable } from "../../../components/common/DataTable";
import { RowActions } from "../../../components/common/RowActions";
import { StatCard } from "../../../components/common/StatCard";
import { Badge } from "../../../components/ui/Badge";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCourses } from "../hooks/useCourses";
import { useCourseStats } from "../hooks/useCourseStats";

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
const getColumns = (role) => {
  const baseColumns = [
    { key: "title", header: "Course" },

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
    {
      key: "actions",
      header: "",
      render: (course) => (
        <RowActions
          onEdit={() => console.log("Edit", course)}
          onDelete={() => console.log("Delete", course)}
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
  const { courses } = useCourses(user.role);
  const stats = useCourseStats();

  const columns = getColumns(user.role);
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
      <div className="grid gap-4 xl:grid-cols-3">
        {stats.map((stat, index) => {
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
