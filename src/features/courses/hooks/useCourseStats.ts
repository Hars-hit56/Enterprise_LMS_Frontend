import { BookOpen, Users, Video } from "lucide-react";
import { useMemo, type ElementType } from "react";
import type { DashboardStat } from "../../../types";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCourses } from "./useCourses";

export type StatWithIcon = DashboardStat & { icon: ElementType };

export function useCourseStats() {
  const { user } = useAuth();
  const { courses } = useCourses(user.role);

  const stats: StatWithIcon[] = useMemo(() => {
    if (!courses.length) return [];

    const totalCourses = courses.length;

    const publishedCourses = courses.filter(
      (c) => c.status === "Published",
    ).length;

    const totalLessons = courses.reduce((sum, c) => sum + (c.lessons || 0), 0);

    const totalStudents = courses.reduce(
      (sum, c) => sum + (c.students || 0),
      0,
    );

    const avgRating =
      courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length;

    return [
      {
        id: "1",
        label: "Total Courses",
        value: totalCourses.toString(),
        delta: `${publishedCourses} published`,
        tone: "brand",
        icon: BookOpen,
      },
      {
        id: "2",
        label: "Total Lessons",
        value: totalLessons.toString(),
        delta: `${courses.length} courses`,
        tone: "success",
        icon: Video,
      },
      {
        id: "3",
        label: "Total Students",
        value: totalStudents.toLocaleString(),
        delta: "+120 this week",
        tone: "warning",
        icon: Users,
      },
    ];
  }, [courses]);

  return stats;
}
