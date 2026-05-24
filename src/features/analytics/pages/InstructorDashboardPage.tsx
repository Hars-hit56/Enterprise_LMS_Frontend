import { BookOpen, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "../../../components/common/StatCard";
import { DashboardChartSkeleton } from "../../../components/skeletons/DashboardChartSkeleton";
import { StatCardSkeletonGrid } from "../../../components/skeletons/StatCardSkeleton";
import { Card } from "../../../components/ui/Card";
import { DashboardSection } from "../components/DashboardSection";
import { useInstructorAnalytics } from "../hooks/useAnalytics";

const fallbackIcons = [Users, BookOpen, TrendingUp];

export function InstructorDashboardPage() {
  const { stats, engagementData, progressData, isLoading, error } =
    useInstructorAnalytics();

  return (
    <DashboardSection
      title="Instructor overview"
      description="Track course health, learner momentum, and the next teaching priorities."
    >
      {error ? (
        <p className="text-sm font-medium text-danger-700">{error}</p>
      ) : null}
      {isLoading ? (
        <StatCardSkeletonGrid />
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon ?? fallbackIcons[index] ?? Users;
            return (
              <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
            );
          })}
        </div>
      )}
      {isLoading ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DashboardChartSkeleton />
          <DashboardChartSkeleton />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
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
                    dataKey="enrollments"
                    name="Enrollments"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="submissions"
                    name="Submissions"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              <h3 className="font-semibold">Progress Tracking</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    formatter={(value) => [`${value}%`, "Progress"]}
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
                  <Line
                    type="monotone"
                    dataKey="progress"
                    name="Progress"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </DashboardSection>
  );
}
