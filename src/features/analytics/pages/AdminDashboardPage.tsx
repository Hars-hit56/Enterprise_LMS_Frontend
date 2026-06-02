import { useMemo } from "react";
import {
  BookOpen,
  BrainCircuit,
  CircleAlert,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "../../../components/common/StatCard";
import { DashboardChartSkeleton } from "../../../components/skeletons/DashboardChartSkeleton";
import { StatCardSkeletonGrid } from "../../../components/skeletons/StatCardSkeleton";
import { Card } from "../../../components/ui/Card";
import type { Course } from "../../../types";
import { useCourses } from "../../courses/hooks/useCourses";
import { DashboardSection } from "../components/DashboardSection";
import { useAdminAnalytics } from "../hooks/useAnalytics";
import type { AdminAnalyticsResponse } from "../services/analyticsService";

const distributionColors = ["#2563eb", "#22c55e", "#f59e0b", "#0ea5e9"];

const fallbackIcons = [Users, GraduationCap, TrendingUp, CircleAlert];
type InsightTone = "insight" | "warning" | "success";
type CourseDistributionEntry = {
  name: string;
  value: number;
  students: number;
  color: string;
};

function getCourseStudentCount(course: Course) {
  return course.students ?? course.enrolledStudents?.length ?? 0;
}

function buildCourseDistribution(courses: Course[]) {
  const categoryMap = new Map<string, CourseDistributionEntry>();

  courses.forEach((course) => {
    const category = course.category || "Uncategorized";
    const existing = categoryMap.get(category);

    if (existing) {
      existing.value += 1;
      existing.students += getCourseStudentCount(course);
      return;
    }

    categoryMap.set(category, {
      name: category,
      value: 1,
      students: getCourseStudentCount(course),
      color: distributionColors[categoryMap.size % distributionColors.length],
    });
  });

  return Array.from(categoryMap.values());
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, Math.round(progress)));
}

function buildAdminInsights(
  admin: AdminAnalyticsResponse | null,
  courses: Course[],
  distributionData: CourseDistributionEntry[],
) {
  const topCategory = [...distributionData].sort(
    (a, b) => b.students - a.students || b.value - a.value,
  )[0];
  const publishedCourses = courses.filter((course) => course.isPublished);
  const draftCourses = courses.length - publishedCourses.length;
  const totalStudents = courses.reduce(
    (total, course) => total + getCourseStudentCount(course),
    0,
  );
  const topCourse = [...courses].sort(
    (a, b) => getCourseStudentCount(b) - getCourseStudentCount(a),
  )[0];
  const insights: { tone: InsightTone; text: string }[] = [];

  if (topCategory) {
    insights.push({
      tone: "insight",
      text: `${topCategory.name} leads the catalog with ${topCategory.value} courses and ${topCategory.students} enrolled students.`,
    });
  }

  if (draftCourses > 0) {
    insights.push({
      tone: "warning",
      text: `${draftCourses} courses are still in draft. Publishing ready courses can improve catalog availability.`,
    });
  }

  if (topCourse) {
    insights.push({
      tone: "success",
      text: `${topCourse.title} has the highest enrollment with ${getCourseStudentCount(topCourse)} students.`,
    });
  }

  if (admin && insights.length < 3) {
    insights.push({
      tone: "insight",
      text: `${admin.totalEnrolledStudent ?? totalStudents} students are enrolled across ${admin.totalCourses} courses.`,
    });
  }

  if (admin && insights.length < 3) {
    insights.push({
      tone: "success",
      text: `Platform revenue is ${formatCurrency(admin.totalRevenue || 0)} from active learning activity.`,
    });
  }

  return insights.slice(0, 3);
}

function CourseDistributionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: CourseDistributionEntry }[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-line-200 bg-white px-3 py-2 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
      <p className="text-[12px] font-semibold text-ink-950">{item.name}</p>
      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-ink-500">
        <span>Courses</span>
        <span className="text-right font-medium text-ink-900">
          {item.value}
        </span>
        <span>Students</span>
        <span className="text-right font-medium text-ink-900">
          {item.students}
        </span>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { stats, engagementData, progressData, admin, isLoading, error } =
    useAdminAnalytics();
  const { courses, isLoading: isCoursesLoading } = useCourses("admin");
  const distributionData = useMemo(
    () => buildCourseDistribution(courses),
    [courses],
  );
  const totalEnrolledStudents = useMemo(
    () =>
      courses.reduce(
        (total, course) => total + getCourseStudentCount(course),
        0,
      ),
    [courses],
  );
  const insights = useMemo(
    () => buildAdminInsights(admin, courses, distributionData),
    [admin, courses, distributionData],
  );

  return (
    <DashboardSection
      title="Admin overview"
      description="A compact system view across users, courses, reports, and operational health."
    >
      {error ? (
        <p className="text-sm font-medium text-danger-700">{error}</p>
      ) : null}
      {/* STAT CARDS */}
      {isLoading ? (
        <StatCardSkeletonGrid count={4} columns={4} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon ?? fallbackIcons[index];
            return (
              <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
            );
          })}
        </div>
      )}

      {/* ANALYTICS ROW 1 */}
      {isLoading ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DashboardChartSkeleton />
          <DashboardChartSkeleton />
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users size={18} className="text-blue-600" />
            <h3 className="font-semibold">User Engagement</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                />
                <Bar
                  dataKey="totalUsers"
                  name="Total Users"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Bar
                  dataKey="activeUsers"
                  name="Active Users"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              <h3 className="font-semibold">Course Progress</h3>
            </div>
            <span className="rounded-full bg-soft px-3 py-1 text-[11px] font-medium text-ink-600">
              {progressData.length} courses
            </span>
          </div>

          <div className="max-h-[250px] space-y-4 overflow-y-auto pr-1">
            {progressData.length ? (
              progressData.map((course) => {
                const progress = clampProgress(course.progress);

                return (
                  <div
                    key={course.name}
                    className="space-y-2 border-b border-line-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-ink-950">
                          {course.name}
                        </p>
                        <p className="mt-1 text-[11px] text-ink-500">
                          {course.enrollments} enrolled | {course.completed} completed
                        </p>
                      </div>
                      <span className="shrink-0 text-[13px] font-semibold text-brand-600">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-soft">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid h-[250px] place-items-center rounded-lg bg-soft text-center text-sm text-ink-500">
                No course progress data yet.
              </div>
            )}
          </div>
        </Card>
      </div>
      )}

      {/* ANALYTICS ROW 2 */}
      {isLoading || isCoursesLoading ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <DashboardChartSkeleton />
          <div className="lg:col-span-2">
            <DashboardChartSkeleton />
          </div>
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card className="p-6 col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={18} className="text-orange-500" />
            <h3 className="font-semibold">Course Distribution</h3>
          </div>
          <div className="h-[220px] flex items-center justify-center relative">
            {distributionData.length ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={<CourseDistributionTooltip />}
                      wrapperStyle={{ zIndex: 40 }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                    />
                    <Pie
                      data={distributionData}
                      innerRadius={54}
                      outerRadius={82}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center pb-7">
                  <div className="text-center">
                    <span className="block text-[18px] font-semibold text-ink-950">
                      {totalEnrolledStudents}
                    </span>
                    <span className="block text-[10px] font-medium text-ink-500">
                      enrolled students
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-500">No courses found.</p>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit size={18} className="text-blue-500" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightItem
                key={`${insight.tone}-${insight.text}`}
                tone={insight.tone}
                text={insight.text}
              />
            ))}
          </div>
        </Card>
      </div>
      )}
    </DashboardSection>
  );
}

// Helper component for AI Insight Rows
function InsightItem({
  tone,
  text,
}: {
  tone: InsightTone;
  text: string;
}) {
  const configs = {
    insight: "bg-blue-50 border-blue-100 text-blue-700",
    warning: "bg-orange-50 border-orange-100 text-orange-700",
    success: "bg-green-50 border-green-100 text-green-700",
  };

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-xl border ${configs[tone]}`}
    >
      <span
        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${configs[tone]}`}
      >
        {tone}
      </span>
      <p className="text-sm font-medium text-slate-700">{text}</p>
    </div>
  );
}
