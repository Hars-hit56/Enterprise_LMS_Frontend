import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function DashboardSection({
  title,
  description,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-950">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-ink-500">{description}</p>
      </div>
      {children}
    </section>
  );
}
