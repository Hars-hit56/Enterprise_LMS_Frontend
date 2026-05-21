import { useEffect } from "react";
import { BookOpen, IndianRupee, Users, Video } from "lucide-react";
import type { ElementType } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { DashboardStat } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchInstructorAnalytics } from "../store/analyticsStore";

export type StatWithIcon = DashboardStat & { icon: ElementType };

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function useStudentAnalytics(): StatWithIcon[] {
  return [];
}

export function useInstructorAnalytics() {
  const dispatch = useDispatch<AppDispatch>();
  const { instructor, isLoading, error } = useSelector(
    (state: RootState) => state.analytics,
  );

  useEffect(() => {
    void dispatch(fetchInstructorAnalytics());
  }, [dispatch]);

  const stats: StatWithIcon[] = instructor
    ? [
        {
          id: "1",
          label: "Total Students",
          value: formatNumber(instructor.totalStudents),
          tone: "brand",
          icon: Users,
        },
        {
          id: "2",
          label: "Active Courses",
          value: formatNumber(instructor.activeCourses),
          tone: "success",
          icon: BookOpen,
        },
        {
          id: "3",
          label: "Revenue",
          value: formatCurrency(instructor.totalRevenue),
          tone: "warning",
          icon: IndianRupee,
        },
      ]
    : [];

  return { stats, isLoading, error };
}

export function useInstructorContentAnalytics() {
  const dispatch = useDispatch<AppDispatch>();
  const { instructor, isLoading, error } = useSelector(
    (state: RootState) => state.analytics,
  );

  useEffect(() => {
    void dispatch(fetchInstructorAnalytics());
  }, [dispatch]);

  const stats: StatWithIcon[] = instructor
    ? [
        {
          id: "1",
          label: "Total Courses",
          value: formatNumber(instructor.totalCourses),
          tone: "brand",
          delta: `${formatNumber(instructor.activeCourses)} published`,
          icon: BookOpen,
        },
        {
          id: "2",
          label: "Total Lessons",
          value: formatNumber(instructor.totalLessons),
          tone: "success",
          delta: `${formatNumber(instructor.totalCourses)} courses`,
          icon: Video,
        },
        {
          id: "3",
          label: "Total Students",
          value: formatNumber(instructor.totalStudents),
          tone: "warning",
          icon: Users,
        },
      ]
    : [];

  return { stats, isLoading, error };
}

export function useAdminAnalytics(): StatWithIcon[] {
  return [];
}
