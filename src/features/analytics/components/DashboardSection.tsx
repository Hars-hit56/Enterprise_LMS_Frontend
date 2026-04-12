import type { ReactNode } from 'react'

interface DashboardSectionProps {
  title: string
  description: string
  children: ReactNode
}

export function DashboardSection({
  title,
  description,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink-950">{title}</h1>
        <p className="mt-2 text-base text-ink-500">{description}</p>
      </div>
      {children}
    </section>
  )
}
