import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-line-100 bg-white p-4 sm:p-5 md:p-6  shadow-[0_10px_24px_rgba(15,23,42,0.035)] ${className}`}
    >
      {children}
    </div>
  );
}
