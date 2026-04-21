import {
  Activity,
  BookOpen,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ElementType } from "react";
import type { DashboardStat } from "../../../types";
import { mockApi } from "../../../services/mockApi";

export type StatWithIcon = DashboardStat & { icon: ElementType };

export const analyticsService = {
  async getStudentStats() {
    const stats: StatWithIcon[] = [
      {
        id: "1",
        label: "Enrolled Courses",
        value: "3",
        delta: "2 currently ahead of schedule",
        tone: "brand",
        icon: BookOpen,
      },
      {
        id: "2",
        label: "Completed Courses",
        value: "8",
        delta: "1 completed this month",
        tone: "success",
        icon: Activity,
      },
      {
        id: "3",
        label: "Average Score",
        value: "91%",
        delta: "+8% from last assessment cycle",
        tone: "warning",
        icon: TrendingUp,
      },
    ];

    return mockApi(stats);
  },

  async getInstructorStats() {
    const stats: StatWithIcon[] = [
      {
        id: "1",
        label: "Total Students",
        value: "1,248",
        // delta: "+82 this week",
        tone: "brand",
        icon: Users,
      },
      {
        id: "2",
        label: "Active Courses",
        value: "14",
        // delta: "3 awaiting review",
        tone: "success",
        icon: BookOpen,
      },
      {
        id: "3",
        label: "Revenue",
        value: "₹17,600",
        // delta: "+5% vs last cohort",
        tone: "warning",
        icon: IndianRupee,
      },
    ];

    return mockApi(stats);
  },

  async getAdminStats() {
    const stats: StatWithIcon[] = [
      {
        id: "1",
        label: "Total Users",
        value: "10,482",
        delta: "+128 this week",
        tone: "brand",
        icon: Users,
      },
      {
        id: "2",
        label: "Active Courses",
        value: "342",
        delta: "+12 new",
        tone: "success",
        icon: GraduationCap,
      },
      {
        id: "3",
        label: "Completion Rate",
        value: "68%",
        delta: "+3% vs last month",
        tone: "warning",
        icon: TrendingUp,
      },
    ];

    return mockApi(stats);
  },
};
