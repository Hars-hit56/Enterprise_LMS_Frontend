import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  tone?: 'brand' | 'success' | 'warning' | 'neutral'
}

const toneStyles = {
  brand: 'bg-brand-100 text-brand-600',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  neutral: 'bg-line-100 text-ink-700',
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}
    >
      {children}
    </span>
  )
}
