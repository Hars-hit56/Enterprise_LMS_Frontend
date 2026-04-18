import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  children: ReactNode;
}

export function Select({
  label,
  hint,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-ink-900">
      {label ? <span>{label}</span> : null}
      <select
        className={`rounded-lg border border-line-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint ? (
        <span className="text-xs font-normal text-ink-500">{hint}</span>
      ) : null}
    </label>
  );
}
