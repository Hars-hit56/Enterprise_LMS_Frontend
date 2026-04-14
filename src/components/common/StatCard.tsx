import type { ReactNode } from "react";
import type { DashboardStat } from "../../types";
import { Card } from "../ui/Card";

const toneStyles = {
  brand: "bg-brand-100 text-brand-600",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  danger: "bg-danger-100 text-danger-700",
};

interface StatCardProps {
  stat: DashboardStat;
  icon: ReactNode;
}

export function StatCard({ stat, icon }: StatCardProps) {
  const tone = stat.tone ?? "brand";

  return (
    <Card className="flex min-h-[88px] items-start justify-between gap-3 p-3">
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-500">
          {stat.label}
        </p>
        <p className="font-display text-[17px] font-medium leading-none tracking-tight text-ink-950">
          {stat.value}
        </p>
        <p className="text-[11px] leading-[16px] text-ink-500">{stat.delta}</p>
      </div>
      <div className={`rounded-lg p-1.5 ${toneStyles[tone]}`}>{icon}</div>
    </Card>
  );
}
