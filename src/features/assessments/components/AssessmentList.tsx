import { CalendarClock } from 'lucide-react'
import type { Assessment } from '../../../types'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'

interface AssessmentListProps {
  assessments: Assessment[]
}

export function AssessmentList({ assessments }: AssessmentListProps) {
  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <Card key={assessment.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-brand-600">{assessment.course}</p>
            <h3 className="text-lg font-semibold text-ink-950">{assessment.title}</h3>
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <CalendarClock size={16} />
              Due {assessment.dueDate}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={assessment.status === 'Closed' ? 'neutral' : 'brand'}>{assessment.status}</Badge>
            <Badge tone="success">{assessment.submissions} submissions</Badge>
            {assessment.score ? <Badge tone="warning">Score {assessment.score}</Badge> : null}
          </div>
        </Card>
      ))}
    </div>
  )
}
