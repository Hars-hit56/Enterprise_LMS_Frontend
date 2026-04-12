import { Card } from '../../../components/ui/Card'

export function ReportsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink-950">Reports</h1>
        <p className="mt-2 text-base text-ink-500">
          Explore executive snapshots for engagement, retention, and content health.
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-brand-600">Engagement</p>
          <p className="mt-3 text-4xl font-semibold text-ink-950">82%</p>
          <p className="mt-2 text-sm text-ink-500">Weekly active learner rate across all cohorts.</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-brand-600">Retention</p>
          <p className="mt-3 text-4xl font-semibold text-ink-950">74%</p>
          <p className="mt-2 text-sm text-ink-500">30-day course continuation after enrollment.</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-brand-600">Satisfaction</p>
          <p className="mt-3 text-4xl font-semibold text-ink-950">4.7/5</p>
          <p className="mt-2 text-sm text-ink-500">Average learner rating from recent completions.</p>
        </Card>
      </div>
    </section>
  )
}
