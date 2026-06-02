import { BookOpen, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

function clampProgress(progress: number) {
  return Math.min(100, Math.max(0, Math.round(progress)));
}

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
                            {course?.enrollments} enrolled | {course?.completed}{" "}
                            completed
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
    </DashboardSection>
  );
}
