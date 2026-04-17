import { CalendarClock } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { RowActions } from "../../../components/common/RowActions";
import type { Assessment } from "../../../types";

interface AssessmentListProps {
  assessments: Assessment[];
  onEdit?: (assessment: Assessment) => void;
  onDelete?: (assessment: Assessment) => void;
}

export function AssessmentList({
  assessments,
  onEdit,
  onDelete,
}: AssessmentListProps) {
  console.log("assessments", assessments);

  return (
    <div className="space-y-3">
      {assessments.map((assessment) => (
        <Card
          key={assessment.id}
          noShadow
          className="flex flex-col gap-3 !p-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">
              {assessment.course}
            </p>
            <h3 className="text-sm font-medium text-ink-950">
              {assessment.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <CalendarClock size={15} />
              {assessment.dueDate}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* <Badge tone={assessment.status === "Closed" ? "neutral" : "brand"}>
              {assessment.status}
            </Badge> */}
            <Badge tone="success">{assessment.submissions} submissions</Badge>
            {assessment.score ?
              <Badge tone="warning">Score {assessment.score}</Badge>
            : null}
            {(onEdit || onDelete) && (
              <RowActions
                onEdit={onEdit ? () => onEdit(assessment) : undefined}
                onDelete={onDelete ? () => onDelete(assessment) : undefined}
                editLabel="Edit"
                deleteLabel="Delete"
              />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
