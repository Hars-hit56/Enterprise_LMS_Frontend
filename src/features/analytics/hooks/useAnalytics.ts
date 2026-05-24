import { useEffect } from "react";
import { BookOpen, IndianRupee, TrendingUp, Users, Video } from "lucide-react";
import type { ElementType } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { DashboardStat, UserRole } from "../../../types";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchAdminAnalytics,
  fetchInstructorAnalytics,
  fetchStudentAnalytics,
} from "../store/analyticsStore";

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

export function useStudentAnalytics() {
  const dispatch = useDispatch<AppDispatch>();
  const { student, isLoading, error } = useSelector(
    (state: RootState) => state.analytics,
  );

  useEffect(() => {
    void dispatch(fetchStudentAnalytics());
  }, [dispatch]);

  const stats: StatWithIcon[] = student
    ? [
        {
          id: "1",
          label: "Enrolled Courses",
          value: formatNumber(student.enrolledCourses),
          tone: "brand",
          icon: BookOpen,
        },
        {
          id: "2",
          label: "Completed Courses",
          value: formatNumber(student.completedCourses),
          tone: "success",
          icon: Users,
        },
        {
          id: "3",
          label: "Average Score",
          value: `${student.avgScore}%`,
          tone: "warning",
          icon: TrendingUp,
        },
      ]
    : [];

  return { stats, isLoading, error };
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

export function useAdminAnalytics() {
  const dispatch = useDispatch<AppDispatch>();
  const { admin, isLoading, error } = useSelector(
    (state: RootState) => state.analytics,
  );

  useEffect(() => {
    void dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  const stats: StatWithIcon[] = admin
    ? [
        {
          id: "1",
          label: "Total Users",
          value: formatNumber(admin.totalUsers),
          tone: "brand",
          icon: Users,
        },
        {
          id: "2",
          label: "Active Courses",
          value: formatNumber(admin.activeCourses),
          tone: "success",
          icon: BookOpen,
        },
        {
          id: "3",
          label: "Completion Rate",
          value: `${admin.completionRate}%`,
          tone: "warning",
          icon: TrendingUp,
        },
        {
          id: "4",
          label: "Total Revenue",
          value: formatCurrency(admin?.totalRevenue || 0),
          tone: "brand",
          icon: IndianRupee,
        },
      ]
    : [];

  return { stats, isLoading, error };
}

export function useCourseManagementAnalytics(role?: UserRole) {
  const dispatch = useDispatch<AppDispatch>();
  const { admin, instructor, isLoading, error } = useSelector(
    (state: RootState) => state.analytics,
  );

  useEffect(() => {
    if (!role || role === "student") {
      return;
    }

    if (role === "admin") {
      void dispatch(fetchAdminAnalytics());
      return;
    }

    void dispatch(fetchInstructorAnalytics());
  }, [dispatch, role]);

  const dashboardData = role === "admin" ? admin : instructor;

  const totalStudents =
    role === "admin"
      ? (admin?.totalEnrolledStudent ?? admin?.totalUsers ?? 0)
      : (instructor?.totalStudents ?? 0);

  const stats: StatWithIcon[] = dashboardData
    ? [
        {
          id: "1",
          label: "Total Courses",
          value: formatNumber(dashboardData.totalCourses ?? 0),
          tone: "brand",
          delta: `${formatNumber(dashboardData.activeCourses ?? 0)} published`,
          icon: BookOpen,
        },
        {
          id: "2",
          label: "Total Lessons",
          value: formatNumber(dashboardData.totalLessons ?? 0),
          tone: "success",
          delta: `${formatNumber(dashboardData.totalCourses ?? 0)} courses`,
          icon: Video,
        },
        {
          id: "3",
          label: "Total Students",
          value: formatNumber(totalStudents || 0),
          tone: "warning",
          icon: Users,
        },
      ]
    : [];

  return { stats, isLoading, error };
}
