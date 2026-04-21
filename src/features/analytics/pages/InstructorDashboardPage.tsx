import { BookOpen, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "../../../components/common/StatCard";
import { Card } from "../../../components/ui/Card";
import { DashboardSection } from "../components/DashboardSection";
import { useInstructorAnalytics } from "../hooks/useAnalytics";

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

const fallbackIcons = [Users, BookOpen, TrendingUp];

export function InstructorDashboardPage() {
  const stats = useInstructorAnalytics();

  return (
    <DashboardSection
      title="Instructor overview"
      description="Track course health, learner momentum, and the next teaching priorities."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon ?? fallbackIcons[index];
          return (
            <StatCard key={stat.id} stat={stat} icon={<Icon size={22} />} />
          );
        })}
      </div>
      {/* ANALYTICS ROW 1 */}
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
    </DashboardSection>
  );
}
