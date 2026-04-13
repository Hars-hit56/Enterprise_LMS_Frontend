import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-line-100 bg-white p-6 shadow-[0_6px_16px_rgba(15,23,42,0.035)] ${className}`}
    >
      {children}
    </div>
  );
}
