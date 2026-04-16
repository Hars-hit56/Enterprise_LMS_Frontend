import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

export function CreateCoursePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink-950">
          Create Course
        </h1>
        <p className="mt-2 text-base text-ink-500">
          Launch new curriculum with a modular authoring workflow.
        </p>
      </div>
      <Card className="max-w-3xl space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Course title" placeholder="Advanced React Patterns" />
          <Input label="Category" placeholder="Development" />
        </div>
        <Input label="Audience" placeholder="Mid-level engineers" />
        <label className="flex flex-col gap-2 text-sm font-medium text-ink-900">
          Overview
          <textarea
            className="min-h-36 rounded-2xl border border-line-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            placeholder="Describe outcomes, level, and what learners will build."
          />
        </label>
        <div className="flex gap-3">
          <Button type="button">Save draft</Button>
          <Button type="button" variant="secondary">
            Send for review
          </Button>
        </div>
      </Card>
    </section>
  );
}
