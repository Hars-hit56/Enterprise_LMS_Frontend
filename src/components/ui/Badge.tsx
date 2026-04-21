import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "brand" | "success" | "warning" | "neutral";
  className?: string;
}

const toneStyles = {
  brand: "bg-brand-100 text-brand-600",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  neutral: "bg-line-100 text-ink-700",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
