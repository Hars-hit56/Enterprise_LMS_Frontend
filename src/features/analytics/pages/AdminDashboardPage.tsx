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
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "../../../components/common/StatCard";
import { DashboardChartSkeleton } from "../../../components/skeletons/DashboardChartSkeleton";
import { StatCardSkeletonGrid } from "../../../components/skeletons/StatCardSkeleton";
import { Card } from "../../../components/ui/Card";
import { DashboardSection } from "../components/DashboardSection";
import { useAdminAnalytics } from "../hooks/useAnalytics";

// --- Mock Data for Charts ---
const engagementData = [
  { day: "Mon", total: 420, active: 40 },
  { day: "Tue", total: 380, active: 50 },
  { day: "Wed", total: 510, active: 30 },
  { day: "Thu", total: 470, active: 60 },
  { day: "Fri", total: 390, active: 50 },
  { day: "Sat", total: 250, active: 25 },
  { day: "Sun", total: 180, active: 15 },
];

const progressData = [
  { week: "Week 1", value: 25 },
  { week: "Week 2", value: 38 },
  { week: "Week 3", value: 52 },
  { week: "Week 4", value: 61 },
  { week: "Week 5", value: 69 },
  { week: "Week 6", value: 74 },
];

const distributionData = [
  { name: "Development", value: 42, color: "#2563eb" },
  { name: "Data Science", value: 28, color: "#22c55e" },
  { name: "Design", value: 18, color: "#f59e0b" },
  { name: "Marketing", value: 12, color: "#0ea5e9" },
];

const fallbackIcons = [Users, GraduationCap, TrendingUp, CircleAlert];

export function AdminDashboardPage() {
  const { stats, isLoading, error } = useAdminAnalytics();

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
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Bar
                  dataKey="total"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Bar
                  dataKey="active"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
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
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
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

      {/* ANALYTICS ROW 2 */}
      {isLoading ? (
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
          <div className="h-[200px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-blue-600">
                Development 42%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit size={18} className="text-blue-500" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-4">
            <InsightItem
              tone="insight"
              text="Students who complete quizzes are 3x more likely to finish courses"
            />
            <InsightItem
              tone="warning"
              text="Engagement drops 40% after Module 3 in ML Fundamentals — consider restructuring"
            />
            <InsightItem
              tone="success"
              text="React Patterns has the highest completion rate at 72%"
            />
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
  tone: "insight" | "warning" | "success";
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
