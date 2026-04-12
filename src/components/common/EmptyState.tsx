import { Sparkles } from 'lucide-react'
import { Card } from '../ui/Card'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-start gap-3">
      <div className="rounded-2xl bg-brand-100 p-3 text-brand-600">
        <Sparkles size={20} />
      </div>
      <h3 className="text-lg font-semibold text-ink-950">{title}</h3>
      <p className="max-w-md text-sm text-ink-500">{description}</p>
    </Card>
  )
}
